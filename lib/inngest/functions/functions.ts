import { inngest } from "@/lib/inngest/client";
import { NEWS_SUMMARY_EMAIL_PROMPT, PERSONALIZED_WELCOME_EMAIL_PROMPT } from "../prompts";
import { sendNewsSummaryEmail, sendWelcomeEmail } from "@/lib/nodemailer";
import { getAllUsersForNewsemail } from "@/lib/actions/user.actions";
import { getWatchlistSymbolsByEmail } from "@/lib/actions/watchlist.actions";
import { getNews } from "@/lib/actions/finnhub.actions";
import { formatDateToday } from "@/lib/utils";

export const sendSIgnUpEmail = inngest.createFunction(
   { id:'sign-up-email'},
   {event: 'app/user.created'},
   async ({event, step})=>{
    const userProfile=`
        -Country:${event.data.country}
        -Investment Goal: ${event.data.investmentGoal}
        -Risk Tolerance: ${event.data.riskTolerance}
        -Preferred industry: ${event.data.preferredIndustry}    
    `
    const prompt = PERSONALIZED_WELCOME_EMAIL_PROMPT.replace('{{user_profile}}', userProfile);
    const response = await step.ai.infer('generate-welcome-intro',{
        model: step.ai.models.gemini({model:'gemini-2.0-flash-lite'}),
        body:{
            contents:[{
                role:'user',
                parts:[{text: prompt}]
            }]
        }
    })    
    
    await step.run('send-welcome-email', async()=>{
        const part =response.candidates?.[0]?.content?.parts?.[0];
        let introText =(part && 'text' in part? part.text: null)|| 'Thanks for joining investro . You now  have the tools to start your investment journey with confidence. ';
        introText =introText.replace(/^```[a-z]*\s*/, '');
        const {data:{email,name}} = event;
        return await sendWelcomeEmail({
            email, name, intro: introText
        })
    })

    return{
        success: true,
        message: 'Welcome email sent successfully'
    }
   }
)

export const sendDailyNewsSummary = inngest.createFunction(
    {id:'daily-news-summary'},
    [{event: 'app/user.daily.news'} , { cron: '15 9 * * *', tz: 'Asia/Kolkata' }], 
    async ({step} )=>{;
        //Step #1: Get all users for news delivery
        const users = await step.run('get-all-users', getAllUsersForNewsemail)
        if(!users || users.length===0){return{success:true, message:'No users found for news email'}}
        //Step #2: Fetch personalized news for each user, for each user get watchlist symbols -> fetch news(fallback to general)
        const results = await step.run('fetch-user-news', async()=>{
            const perUser: Array<{user: User;articles: MarketNewsArticle[]}>=[];
            for (const user of users as User[]) {
                try {
                    const symbols = await getWatchlistSymbolsByEmail(user.email);
                    let articles= await getNews(symbols);
                    if(!articles || articles.length===0) {
                        articles= await getNews(); // General news fallback
                    }
                    perUser.push({user, articles});
                } catch (err) {
                    console.error('daily-news: Error fetching news for user ', user.email, err);
                    perUser.push({user, articles: []});
                }
            }
            return perUser;
        })
        //Step #3: Summarize news via AI for each user
        const userNewsSummaries: {user : User; newsContent: string| null}[]=[];
        for (const {user, articles} of results){
            try {
                const prompt = NEWS_SUMMARY_EMAIL_PROMPT.replace('{{newsData}}', JSON.stringify(articles,null,2));
                const response = await step.ai.infer(`summarize-news-${user.email}`,{
                    model:step.ai.models.gemini({model:'gemini-2.0-flash-lite'}),
                    body:{
                        contents:[{role:'user', parts:[{text: prompt}]}]
                    }
                })
                const part =response.candidates?.[0]?.content?.parts?.[0];
                let newsContent =(part && 'text' in part? part.text: null) || 'No market news';
                newsContent = newsContent.replace(/^```[a-z]*\s*/, '');
                userNewsSummaries.push({user, newsContent});
            } catch (e) {
                console.error('Failed to summarize news for user ', user.email, e);
                userNewsSummaries.push({user, newsContent: null});
            }
        }
        //Step #4: Send emails
        await step.run('send-news-emails', async()=>{
            //
            await Promise.all(
                userNewsSummaries.map(async({user, newsContent})=>{
                    if(!newsContent)return false;
                    return await sendNewsSummaryEmail({name: user.name, email: user.email, date: formatDateToday, summary: newsContent})
                })
            )
        })
        return {success: true, message: 'Daily news summaries sent successfully' };
    }
)
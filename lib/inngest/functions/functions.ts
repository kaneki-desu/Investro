import { inngest } from "@/lib/inngest/client";
import { PERSONALIZED_WELCOME_EMAIL_PROMPT } from "../prompts";
import { sendWelcomeEmail } from "@/lib/nodemailer";

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
        const introText =(part && 'text' in part? part.text: null)|| 'Thanks for joining investro . You now  have the tools to start your investment journey with confidence. ';
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
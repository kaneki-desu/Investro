'use server'
import { auth } from "@/lib/better-auth/auth";
import { inngest } from "@/lib/inngest/client";
import { success } from "better-auth";
import { err } from "inngest/types";
import { headers } from "next/headers";
export const signUpwithEmail = async ({email, password, fullName, riskTolerance, investmentGoals, country , preferredIndustry}: SignUpFormData)=>{
    try {
        const response = await auth.api.signUpEmail({
            body:{email: email, password: password, name: fullName}
        })

        if(response){
            await inngest.send({
                name:'app/user.created',
                data:{
                    email,
                    name: fullName,
                    riskTolerance,
                    investmentGoals,
                    country,    
                    preferredIndustry
                }
            })
        }
        return {success: true, message: 'User signed up successfully'};
    } catch (error) {
        console.error('Error in signUpwithEmail:', error);
        return {success: false,  message: error instanceof Error ? error.message : 'Error signing up'}
    }
}

export const signOut = async()=>{
    try {
        await auth.api.signOut({headers: await headers()});
    } catch (e) {
        console.log('Error signing out:', e);
        return {success: false, message: e instanceof Error ? e.message : 'Error signing out'};
    }
}

export const signInwithEmail = async ({email, password}: SignInFormData)=>{
    try {
        const response = await auth.api.signInEmail({
            body:{email: email, password: password}
        })
        return {success: true,data:response, message: 'User signed in successfully'};
    } catch (error) {
        console.error('Error in signInwithEmail:', error);
        return {success: false,  message: error instanceof Error ? error.message : 'Error signing in'}
    }
}
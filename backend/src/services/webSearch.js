import { tavily } from "@tavily/core";
const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });


export async function webSearch({query}){
    console.log("Tool Called:", query);
    const response = await tvly.search(query, {
        search_depth : "basic",
        max_results : 1,
        include_answer : true
    });
    return response.answer
}

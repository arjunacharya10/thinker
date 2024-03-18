import {supabaseClient} from './supabase'
export const createKanban =async (projectId,name) =>{
    const {data,error} = await supabaseClient
	.from('kanbans')
	.insert({name:name, project_id:projectId})
	.select()
	.maybeSingle()
	return {data,error};
}
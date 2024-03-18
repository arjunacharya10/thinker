import { supabaseClient } from "./supabase";

export const getBoardData = async (boardId) => {
    const { data, error } = await supabaseClient
	.from('boards')
	.select()
	.eq('id', boardId)
	.maybeSingle()
	if(data)
		return JSON.parse(data.snapshot)
}

export const createBoard = async (projectId,name) =>{
	const {data,error} = await supabaseClient
	.from('boards')
	.insert({name:name, project_id:projectId})
	.select()
	.maybeSingle()
	return {data,error};
}

export const getBoardName = async (boardId) => {
	const {data,error} = await supabaseClient
	.from('boards')
	.select('name')
	.maybeSingle()

	return data;
}
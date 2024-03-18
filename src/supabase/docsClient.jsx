import {supabaseClient} from './supabase'
export const createDoc =async (projectId,name) =>{
    const {data,error} = await supabaseClient
	.from('docs')
	.insert({name:name, project_id:projectId})
	.select()
	.maybeSingle()
	return {data,error};
}

export const deletDoc = async (docId,boardId) =>{
	const { error } = await supabaseClient
	.from('embeddedDocs')
	.delete()
	.match({id:docId,board_id:boardId})
	if(error)
		console.log(error)
}
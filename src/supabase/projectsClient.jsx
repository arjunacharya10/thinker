import { supabaseClient } from "./supabase";
export const createProject = async (user,name) => {
    const {data, error } = await supabaseClient
                    .from('projects')
                    .insert({ name: name, user_id: user.id })
                    .select();
    if(!error)
        return(data)
}

export const getBoards = async () =>{
    const {data,error} = await supabaseClient
                        .from('projects')
                        .select('id,boards(id,name)');
    if(!error)
        return data;
}

export const getDocs = async () =>{
    const {data,error} = await supabaseClient
                        .from('projects')
                        .select('id,docs(id,name)');
    if(!error)
        return data;
}

export const getKanbans = async () =>{
    const {data,error} = await supabaseClient
                        .from('projects')
                        .select('id,kanbans(id,name)');
    if(!error)
        return data;
}

export const getProjects = async (user) => {
    const {data,error} = await supabaseClient
                        .from('projects')
                        .select()
                        .eq('user_id',user.id);
    if(!error)
        return(data);
}

export const getBoardsforProject = async (projectId) =>{
    const {data,error} = await supabaseClient
                        .from('boards')
                        .select('id,name')
                        .eq('project_id',projectId);
    if(!error)
        return data;
}

export const getDocsforProject = async (projectId) =>{
    const {data,error} = await supabaseClient
                        .from('docs')
                        .select('id,name')
                        .eq('project_id',projectId);
    if(!error)
        return data;
}

export const getKanbansforProject = async (projectId) =>{
    const {data,error} = await supabaseClient
                        .from('kanbans')
                        .select('id,name')
                        .eq('project_id',projectId);
    if(!error)
        return data;
}
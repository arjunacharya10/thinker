import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useLoaderData, useParams } from 'react-router-dom';
import { supabaseClient } from '../../supabase/supabase';

const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline','strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image'],
      ['code-block'],
      ['clean']
    ],
}

const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image',
    'script','code-block'
]

const loadDocumentFromDb = async (docId,projectId) =>{
  const stringified = localStorage.getItem(docId)
  const {data,error} = await supabaseClient
                .from('docs')
                .select()
                .match({id:docId})
                .maybeSingle()
  if(!error && data.data)
    return  JSON.parse(data.data);
  return JSON.parse(stringified)
}

async function save (docId, value,projectId) {
  const stringified = JSON.stringify(value)
	localStorage.setItem(docId, stringified)
	const { error } = await supabaseClient
	.from('docs')
	.upsert({ id: docId, project_id:projectId, data: stringified})
}

export default function Doc() {
  const [value, setValue] = useState('');
  const [loading,setLoading] = useState(false)
  const {docId,projectId} = useParams()

  async function handleKeyDown(event){
		if ((event.ctrlKey || event.metaKey) && event.key === "s") {
		  event.preventDefault(); // Prevent the default browser behavior (saving the webpage)
		  // Call your custom function here
		  await save(docId,value,projectId);
	  }
	}

  useEffect(()=>{
    setLoading(true)

    //get from db
    async function dbLoader(){
      const data = await loadDocumentFromDb(docId,projectId)

      setValue(data)
      setLoading(false)
    }

    dbLoader()

    return () =>{
      setLoading(false)
    }

  },[docId])

  function handleChange(content, delta, source, editor) {
    setValue(editor.getContents());
  }

  return (
    <>
      <ReactQuill onKeyDown={handleKeyDown} theme="snow" value={value} modules={modules} formats={formats} onChange={handleChange} />
      <span style={{position:'absolute', bottom:5, right:5, fontSize:12, fontWeight:700}}>Cmd + s to save</span>
    </>
  )
  
}
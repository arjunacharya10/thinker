import React, { useEffect, useState } from 'react'
import ReactQuill from 'react-quill'
import { useParams } from 'react-router-dom'
import {
    HTMLContainer,
    Rectangle2d,
    ShapeUtil,
    T,
    resizeBox,
    structuredClone,
    useIsEditing
} from 'tldraw'
import { supabaseClient } from '../../../../supabase/supabase'
import './docShape.css';

const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline','strike', 'blockquote', 'link'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
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

const loadDocumentFromDb = async (docId,boardId) =>{
	const stringified = localStorage.getItem(docId+boardId)
	const {data,error} = await supabaseClient
				  .from('embeddedDocs')
				  .select()
				  .match({id:docId,board_id:boardId})
				  .maybeSingle()
	if(!error && data)
	  return  JSON.parse(data.data);
	console.log(error)
	return JSON.parse(stringified)
  }
  
  async function save (docId, value,boardId) {
	const stringified = JSON.stringify(value)
	  localStorage.setItem(docId+boardId, stringified)
	  const { error } = await supabaseClient
	  .from('embeddedDocs')
	  .upsert({ id: docId, board_id:boardId, data: stringified})
	  console.log(error)
  }

export class DocShapeUtil extends ShapeUtil {
	// [2]
	static type = 'DocShape'
	static props = {
		w: T.number,
		h: T.number
	}

	constructor(props){
		super(props)
	}

	// [3]
	isAspectRatioLocked = (_shape) => false
	canResize = (_shape) => true
	canBind = (_shape) => true

	// [4]
	canEdit = () => true

	canScroll = () => true

	// [5]
	getDefaultProps() {
		return {
			w: 400,
			h: 300
		}
	}

	// [6]
	getGeometry(shape) {
		return new Rectangle2d({
			width: shape.props.w,
			height: shape.props.h,
			isFilled: true,
		})
	}

	

	// [7]
	component(shape) {
		const [value, setValue] = useState('');
		const isEditing = useIsEditing(shape.id)

		async function handleKeyDown(event){
				if ((event.ctrlKey || event.metaKey) && event.key === "s") {
					console.log('save pressed')
				event.preventDefault(); // Prevent the default browser behavior (saving the webpage)
				// Call your custom function here
				await save(shape.id.split(':')[1],value,shape.meta.boardId);
			}
		}

		useEffect(()=>{
			//get from db
			async function dbLoader(){
				const data = await loadDocumentFromDb(shape.id.split(':')[1],shape.meta.boardId)
				setValue(data)
			}
			dbLoader()

			return () =>{
			
			}

		},[])

		function handleChange(content, delta, source, editor) {
			setValue(editor.getContents());
		}

  		return (
			<HTMLContainer id={shape.id} onScroll={(e)=>e.stopPropagation()}>
				<div style={{
					height:'100%',
					pointerEvents:'all',
					overflowY:'hidden',
					backgroundColor:'#fefefe',
					position:'relative'
				}}
				onPointerDown={(e)=>{
					if(isEditing){
						e.stopPropagation()
					}
				}}
				onScroll={(e)=>{
					e.stopPropagation()
				}}	
				>
          			<ReactQuill style={{fontSize:22}} readOnly={!isEditing} onKeyDown={handleKeyDown} theme="snow" value={value} modules={modules} formats={formats} onChange={handleChange} />
					  {
						isEditing? <span style={{position:'absolute', bottom:5, right:5, fontSize:12, fontWeight:700}}>Cmd + s to save</span> : null
					}
				</div>
			</HTMLContainer>
  		)
	}

	// [8]
	indicator(shape) {
		const isEditing = useIsEditing(shape.id)
		return <rect stroke={isEditing ? 'red' : 'blue'} width={shape.props.w} height={shape.props.h} />
	}

	// [9]
	onResize = (shape, info) => {
		return resizeBox(shape, info)
	}

	// [10]
	onEditEnd = (shape) => {
		const frame1 = structuredClone(shape)
		const frame2 = structuredClone(shape)

		frame1.x = shape.x + 1.2
		frame2.x = shape.x - 1.2

		this.editor.animateShape(frame1, { duration: 50 })

		setTimeout(() => {
			this.editor.animateShape(frame2, { duration: 50 })
		}, 100)

		setTimeout(() => {
			this.editor.animateShape(shape, { duration: 100 })
		}, 200)
	}
}

import { Tldraw, createTLStore, defaultShapeUtils } from "@tldraw/tldraw";
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabaseClient } from '../../supabase/supabase';
import './board.css';
import { DocShapeUtil } from "./customComponents/embeddedDocument/doc-shape-component";
import { DocShapeTool } from "./customComponents/embeddedDocument/docs-shape-tool";
import { components, customAssetUrls, uiOverrides } from "./customComponents/ui-overrides";
import { deletDoc } from "../../supabase/docsClient";

const customShapeUtils = [DocShapeUtil]
const customTools = [DocShapeTool]

async function getRemoteSnapshot(boardId) {
  const stringified = localStorage.getItem(boardId)
  const { data, error } = await supabaseClient
	.from('boards')
	.select()
	.match({id:boardId})
	.maybeSingle()

  if(data)
	return JSON.parse(data.snapshot)
  return JSON.parse(stringified)
}


async function save (store, boardId, projectId) {
	const snapshot = store.getSnapshot()
	const stringified = JSON.stringify(snapshot)
	localStorage.setItem(boardId, stringified)
	const { error } = await supabaseClient
	.from('boards')
	.upsert({ id: boardId, project_id:projectId, snapshot: stringified})
	
}


export default function Board () {

  	const [storeWithStatus, setStoreWithStatus] = useState({
		status: 'loading',
	})
	const {boardId,projectId} = useParams()

	async function handleKeyDown(event){
		if ((event.ctrlKey || event.metaKey) && event.key === "s") {
		  event.preventDefault(); // Prevent the default browser behavior (saving the webpage)
		  // Call your custom function here
		await save(storeWithStatus.store,boardId,projectId);
	  }
	}

	useEffect(() => {
		let cancelled = false
		// Create the store
		const newStore = createTLStore({shapeUtils:[...customShapeUtils, ...defaultShapeUtils]})
		setStoreWithStatus({
			store: newStore,
			status: 'loading',
		})
		async function loadRemoteSnapshot() {

			// Get the snapshot
			const snapshot = await getRemoteSnapshot(boardId)
			if (cancelled) return

			// Load the snapshot
			if(snapshot)
			newStore.loadSnapshot(snapshot)

			// Update the store with status
			setStoreWithStatus({
				store: newStore,
				status: 'ready',
			})
		}

		loadRemoteSnapshot()

		return () => {
			cancelled = true
		}
	},[boardId])




  return (
	<div id="tldraw" onKeyDown={handleKeyDown}>
		<Tldraw 
			persistenceKey='thinker' 
			store={storeWithStatus}
			shapeUtils={customShapeUtils}
			// Pass in the array of custom tools
			tools={customTools}
			// Pass in any overrides to the user interface
			overrides={uiOverrides}
			assetUrls={customAssetUrls}
			// pass in the new Keyboard Shortcuts component
			components={{...components,HelpMenu:()=>(<span style={{fontWeight:700,marginRight:10}}>Cmd + s to save</span>)}}
			onMount={(editor) => {
				editor.getInitialMetaForShape = (shape) => {
						return { boardId: boardId}
				}

				editor.addListener('change',async ({changes})=>{
					if(Object.keys(changes.added).length!== 0 || Object.keys(changes.removed).length!== 0  ){
						save(storeWithStatus.store,boardId,projectId)
					}

					Object.keys(changes.removed).forEach(function(key) {
						const shapeinfo = changes.removed[key]
						console.log(shapeinfo)
						if(shapeinfo.type === 'DocShape'){
							// delete from db
							console.log("Deleting",shapeinfo)
							deletDoc(shapeinfo.id.split(':')[1],shapeinfo.meta.boardId)
						}
					})
				})
			}}
		/>
	</div>
  )
}
import React, { useEffect, useState } from 'react'
import { Tldraw, createTLStore, defaultShapeUtils } from "@tldraw/tldraw";
import './home.css'

async function getRemoteSnapshot(user,supabaseClient) {
  const stringified = localStorage.getItem('thinker2')
  if(user){
	const { data, error } = await supabaseClient
	.from('snapshots')
	.select()
	.eq('id', user.id)
	.maybeSingle()
	if(data)
		return JSON.parse(data.snapshot)
  }
  return JSON.parse(stringified)
}


async function save (store, user, supabaseClient) {
	const snapshot = store.getSnapshot()
	const stringified = JSON.stringify(snapshot)
	localStorage.setItem('thinker2', stringified)

	// insert to db
	if(user){
		const { error } = await supabaseClient
		.from('snapshots')
		.upsert({ id: user.id, snapshot: stringified})
	}
	
}


export default function Home ({supabaseClient}) {

  	const [storeWithStatus, setStoreWithStatus] = useState({
		status: 'loading',
	})

    const [user, setUser] = useState(null)

	async function handleKeyDown(event){
		if ((event.ctrlKey || event.metaKey) && event.key === "s") {
		  event.preventDefault(); // Prevent the default browser behavior (saving the webpage)
		  // Call your custom function here
		await save(storeWithStatus.store,user,supabaseClient);
	  }
	}

	useEffect(() => {
		let cancelled = false
		async function loadRemoteSnapshot() {

			//Get user
			const { data, error } = await supabaseClient.auth.getSession()
			console.log(data)
            if(!error && data.session)
				setUser(data.session.user);

			// Get the snapshot
			const snapshot = await getRemoteSnapshot(data.session?.user,supabaseClient)
			if (cancelled) return

			// Create the store
			const newStore = createTLStore({shapeUtils:defaultShapeUtils})

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
	},[])


  return (
	<div onKeyDown={handleKeyDown}>
		<div style={{position: 'fixed', left:5, top:0, height:40}}>
			<div style={{display:'flex', flexDirection:'row', justifyContent:'space-evenly', alignItems:'center'}}>
				{/* <SaveButton store={storeWithStatus.store} user={user} supabaseClient={supabaseClient}/> */}
				<p style={{color:'black',fontSize:12,fontWeight:600, marginLeft:5}}>Cmd + s to save</p>
			</div>
		</div>
        <div style={{position: 'fixed', right:5, top:5}}>
			<button style={{backgroundColor:'red'}} onClick={async ()=> {
                const { error } = await supabaseClient.auth.signOut()
            }}>Sign out</button>
		</div>
		<div style={{ position: 'fixed', inset: 0, marginTop:35 }}>
        	<Tldraw persistenceKey='thinker2' store={storeWithStatus}/>
      </div>
	</div>
  )
}
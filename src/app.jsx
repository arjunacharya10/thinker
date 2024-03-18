import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import React, { useEffect, useState } from 'react'
import './app.css'
import Projects from './projects'
import { supabaseClient as supabase } from './supabase/supabase'


export default function App() {
  const [session, setSession] = useState(null)

  useEffect(() => {
	if(!session){
		supabase.auth.getSession().then(({ data: { session } }) => {
		localStorage.setItem('thinker-session',session)
		setSession(session)
		})
	}

	const {
	  data: { subscription },
	} = supabase.auth.onAuthStateChange((_event, session) => {
	  localStorage.setItem('thinker-session',session)		
	  setSession(session)
	})

	return () => subscription.unsubscribe()
  }, [])

if (!session) {
	return (
		<div style={{display:'flex', flexGrow:1, height:'full', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
			<div style={{width:'40vh'}}>
				<h1 style={{textAlign:'center'}}>Welcome to Thinker!</h1>
				<Auth supabaseClient={supabase} providers={[]} appearance={{ theme: ThemeSupa }} />
			</div>
		</div>
	)
  }
  else {
	return (
		<Projects user={session.user}/>
	)
  }
}

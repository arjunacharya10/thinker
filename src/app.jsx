import React from 'react'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import Home from './home'
import './app.css';

export const supabase = createClient('<YOUR PUBLIC URL>', '<YOUR ANON KEY>')

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
		<div style={{display:'flex', flexGrow:1, width:'40vh', height:'full', flexDirection:'column'}}>
			<h1 style={{textAlign:'center'}}>Welcome to Thinker!</h1>
			<Auth supabaseClient={supabase} providers={[]} appearance={{ theme: ThemeSupa }} />
		</div>
	)
  }
  else {
	return (<Home supabaseClient={supabase}/>)
  }
}

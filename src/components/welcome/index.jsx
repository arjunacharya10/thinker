import React from "react";

export default function Welcome () {
    return (
        <div style={{display:'flex',flexDirection:'column', justifyContent:'center', alignItems:'center', width:'100%', height:'100%', textWrap:'wrap'}}>
            <div style={{width:'80%', textAlign:'center'}}>
                <h1>Welcome to Thinker</h1>
                <p>Thinker is a minimal brainstorming app which helps you quily ideate, make sticky notes, write scratch notes as well as plan todo's and sprints.</p>
                <p style={{color:'red', fontSize:16}}><b>Note: Press Cmd + s to save your changes as Thinker doesnt have autosaves</b></p>
                <p style={{textAlign:'left'}}>Future changes:</p>
                <ol style={{textAlign:'left'}}>
                    <li>Kanban boards to track Todo's and Backlogs</li>
                    <li>Feature to delete projects</li>
                    <li>Social auth</li>
                </ol>
            </div>
        </div>
    )
}
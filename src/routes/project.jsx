import React, { useEffect } from 'react';
import { Form, useLoaderData, useOutlet, useParams } from "react-router-dom";
import ProjectDetails from '../components/projectDetails';

export default function Project() {
  
  const outlet = useOutlet()
  const {projectId} = useParams()

  return(
    outlet || <ProjectDetails projectId={projectId}/>
  )
  
}
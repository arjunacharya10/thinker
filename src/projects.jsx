import * as React from "react";
import {
  createHashRouter,
  redirect,
  RouterProvider,
} from "react-router-dom";
import Board from './components/board';
import ErrorPage from "./error-page";
import "./projects.css";
import Project from "./routes/project";
import Root from "./routes/root";
import {ProjectOutlined, ApartmentOutlined, FileOutlined, FileFilled } from '@ant-design/icons'
import { createProject, getBoards, getBoardsforProject, getDocs, getDocsforProject, getKanbans, getKanbansforProject, getProjects } from "./supabase/projectsClient";
import Doc from "./components/doc";
import Kanban from "./components/kanban";
import { createBoard } from "./supabase/boardsClient";
import { createDoc } from "./supabase/docsClient";
import { createKanban } from "./supabase/kanbanClient";

export default function Projects({user}){


  const getChildren = (boards,docs,kanbans) => {
    const newBoards = boards.map((v)=>({...v,type:"board",icon:<ApartmentOutlined style={{color:'#fa8c16'}}/>}));
    const newDocs = docs.map((v)=>({...v,type:"doc",icon:<FileFilled style={{color:'#7cb305'}}/>}));
    const newKanbans = kanbans.map((v)=>({...v,type:"kanban",icon:<ProjectOutlined style={{color:'#f759ab'}} />}))
    return newBoards.concat(newDocs,newKanbans)
  }

  const router = createHashRouter([
    {
      path: "/",
      element: <Root/>,
      errorElement: <ErrorPage/>,
      loader: async () =>{
        const projects = await getProjects(user);
        /**
         * Get Board IDs and name, get Docs ID and name, get Kanban Ids and name
         */
        const docs = await getDocs();
        const kanbans = await getKanbans();
        const boards = await getBoards();

        const projectsData = [];

        projects.forEach((project,index)=>{
          projectsData.push({
            id: project.id,
            name: project.name,
            children: getChildren(boards[index].boards,docs[index].docs,kanbans[index].kanbans)          
          })
        })

        return { projectsData };
      },
      action: async ({ request, params }) => {
        const formData = await request.formData();
        const updates = Object.fromEntries(formData);
        const data = await createProject(user,updates.name);
        const boardData = await createBoard(data[0].id,'Whiteboard')
        await createDoc(data[0].id,'Scratchpad')
        await createKanban(data[0].id,'Todo')
        return redirect(`projects/${data[0].id}/boards/${boardData.data.id}`);
      },
      children:[
        {
          path:'projects/:projectId',
          element: <Project/>,
          errorElement: <ErrorPage />,
          children: [
            {
              path:'boards/:boardId',
              element: <Board/>,
              errorElement: <ErrorPage />
            },
            {
              path:'docs/:docId',
              element: <Doc/>,
              errorElement: <ErrorPage />
            },
            {
              path:'kanbans/:kanbanId',
              element: <Kanban/>,
              errorElement: <ErrorPage />
            }
          ]
        }
      ]
    },
  ]);



  return(
      <RouterProvider router={router} />
  )
}
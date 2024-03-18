import { Avatar, Badge, Col, Row } from "antd";
import React, { useEffect, useState } from "react";
import {ProjectOutlined, ApartmentOutlined, FileOutlined, PlusOutlined, PlusCircleFilled, FileFilled } from '@ant-design/icons'
import { useParams } from "react-router-dom";
import { getBoardsforProject, getDocsforProject, getKanbansforProject } from "../../supabase/projectsClient";
import './index.css';


export default function ProjectDetails ({projectId}) {

    const [projectDetails,setProjectDetails] = useState({boards:[],docs:[],kanbans:[]})

    useEffect(()=>{
        async function loadProjectDetails(){
            const boards = await getBoardsforProject(projectId)
            const docs = await getDocsforProject(projectId)
            const kanbans = await getKanbansforProject(projectId)

            setProjectDetails({boards,docs,kanbans})
        }
        loadProjectDetails()
    },[projectId])

    const generateElement = (data, elementType) =>(
        <>
            <div style={{display:'flex',flexDirection:'column',alignItems:'center',height:'fit-content' , maxWidth:80}}>
                {
                    elementType === 'board'? <ApartmentOutlined style={{fontSize:40,verticalAlign:'middle', color:'#fa8c16'}}/> :
                    elementType === 'kanban'? <ProjectOutlined style={{fontSize:40,verticalAlign:'middle',color:'#f759ab'}}/> :
                    <FileFilled style={{fontSize:40,verticalAlign:'middle', color:'#7cb305'}}/>
                }
                <p className="fileName" style={{textAlign:'center',whiteSpace:'wrap', lineHeight:1, marginTop:8, paddingBottom:2}}>{data.name}</p>
            </div>
        </>
        
    )

    return(
        <div id="parentDiv">
            <div style={{display:'flex',flexDirection:'row',justifyContent:'start' ,alignItems:'start', width:'100%',flexWrap:'wrap', gap:8, padding:10, marginTop:10}}>
                {
                    projectDetails.boards.map(board=>generateElement(board,"board"))
                }
                {
                    projectDetails.kanbans.map(kanban=>generateElement(kanban,"kanban"))
                }
                {
                    projectDetails.docs.map(doc=>generateElement(doc,"doc"))
                }
            </div>
            <div id="bottom" className="childDiv">
                <div style={{display:'flex', height:'70px', backgroundColor:'#f7f7f7', boxShadow: "2px 3px 2px #9E9E9E",border: '1px solid #e3e3e3', flexDirection:'row', alignItems:'center', justifyContent:'space-evenly', borderRadius:15}}>
                <Badge count={<PlusCircleFilled/>}>
                    <Avatar style={{backgroundColor:'#fa8c16'}} icon={<ApartmentOutlined/>} shape="square" size="large" />
                </Badge>
                <Badge count={<PlusCircleFilled/>}>
                    <Avatar style={{backgroundColor:'#f759ab'}} icon={<ProjectOutlined/>} shape="square" size="large" />
                </Badge>
                <Badge count={<PlusCircleFilled/>}>
                    <Avatar style={{backgroundColor:'#7cb305'}} icon={<FileOutlined/>} shape="square" size="large" />
                </Badge>
                </div>
            </div>
        </div>
    )
}
import React, { useState } from 'react';
import { NavLink, Outlet, useLoaderData, Form, useNavigate, Link, useOutlet } from 'react-router-dom';
import { Avatar, Button, Input, Modal } from 'antd';
import {DownOutlined, FolderAddOutlined, LogoutOutlined, QuestionCircleOutlined} from '@ant-design/icons';
import { Tree, Popconfirm } from 'antd';
import Welcome from '../components/welcome';
import { supabaseClient } from '../supabase/supabase';

const {DirectoryTree} = Tree;

const getParentKey = (key, tree) => {
  let parentKey;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some(item => item.id === key)) {
        parentKey = node.id;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey;
};

export default function Root() {

    const {projectsData} = useLoaderData()
    const [projectName,setProjectName] = useState('')

    const outlet = useOutlet()

    const navigate = useNavigate();

    const onSelect = (keys, info) =>{
      if('children' in info.node){
        // this is a directory
      }
      else{
        // this is a leaf
        const projectId = getParentKey(keys[0],projectsData)
        console.log(`/projects/${projectId}/boards/${info.node.id}`)
        switch(info.node.type){
          case "board":
            navigate(`/projects/${projectId}/boards/${info.node.id}`)
            break;
          case "doc":
            navigate(`/projects/${projectId}/docs/${info.node.id}`)
            break;
          case "kanban":
            navigate(`/projects/${projectId}/kanbans/${info.node.id}`)
            break;
        }
      }
    }

    const onExpand = (keys,info) => {
      console.log('Trigger Expand', keys, info);
    }

    return (
      <>
        <div id="sidebar">
          <div style={{display:'flex', flexDirection:'row', justifyContent:'space-between', padding:7}}>
            <span>Projects</span>
            <Popconfirm
              placement="bottom"
              title={"Create New Project"}
              description={()=>(
                <div style={{marginTop:10}}>
                  <Form method='post' id='project-form'>
                    <Input
                      variant='outlined'
                      size='medium'
                      placeholder="Project Name to Create"
                      aria-label="Project name"
                      type="text"
                      name="name"
                    />
                    {/* <Button key={'submit'} htmlType="submit" form='project-form' type="primary" size='medium'>Confirm</Button> */}
                  </Form>
                  <i style={{fontSize:12}}>Name cannot be changed later.</i>
                </div>
              )}
              okText="Confirm"
              cancelText="Cancel"
              okButtonProps={{
                htmlType:'submit',
                form:'project-form',
                style:{
                  backgroundColor:'green'
                }
              }}
              icon={<QuestionCircleOutlined style={{color:'green'}}/>}
            >
              <Button icon={<FolderAddOutlined />} size='medium'/>
            </Popconfirm>
          </div>
          {/* <h1>Thinker Projects</h1> */}
          <nav>
            {/* {
              projectsData.length? (
                <ul>
                  {projectsData.map((project)=>(
                    <li key={project.id}>
                      <NavLink to={`projects/${project.id}`} style={{height:40}}>
                        <p>{project.name}</p>
                      </NavLink>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No Projects Found</p>
              )
            } */}
            <DirectoryTree 
              defaultExpandAll
              onSelect={onSelect}
              onExpand={onExpand}
              treeData={projectsData}
              fieldNames={{title:'name',key:'id',children:'children'}}
              style={{backgroundColor:"#f7f7f7"}}
            />

          </nav>
          <div style={{display:'flex',flexDirection:'row', justifyContent:'space-between', alignItems:'center',padding: '6px 10px', borderTop: '1px solid #e3e3e3'}}>
            {/* <span style={{display:'flex', alignItems:'center'}}><Avatar shape="square" src={'/images/icongrey.png'} />Thinker</span> */}
            <a style={{fontSize:14}} href='https://www.github.com/arjunacharya10/thinker' target="_blank" rel="noreferrer" >Github</a>
            <Button onClick={async ()=>await supabaseClient.auth.signOut()} type="default" icon={<LogoutOutlined />} size={'small'} />
          </div>
        </div>
        <div id="detail">
          {outlet || <Welcome/>}
        </div>
      </>
    );
  }
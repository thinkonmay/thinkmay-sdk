import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { ToolBar } from "../../../utils/general";

const listFeedBack = [{
  name: 'Terrible',
  value: 'terrible',
  src: 'img/icon/terrible.png'
},{
  name: 'Bad',
  value: 'bad',
  src: 'img/icon/bad.png'
},{
  name: 'Good',
  value: 'good',
  src: 'img/icon/good.png'
},{
  name: 'Amazing',
  value: 'amazing',
  src: 'img/icon/amazing.png'
}

]

const listErr = [
  {
    name: 'Control',
    value: 'control',
    data: [
      {
        name: 'Keybroad',
        value: 'keybroad'
      },
      {
        name: 'Mouse',
        value: 'mouse'
      },
      {
        name: 'GamePad',
        value: 'gamepad'
      },
      {
        name: 'Touch',
        value: 'touch'
      }
    ]
  },
  {
    name: 'Connect',
    value: 'connect',
    data: [
      {
        name: 'Black screen',
        value: 'blackscreen'
      },
      {
        name: 'Lag',
        value: 'lag'
      }
    ]
  },
  {
    name: 'Game',
    value: 'Game',
    data: []
  },
  {
    name: 'Others',
    value: 'others',
    data: []
  }
]
export const FeedBack = () => {
  const [selector, setSelector] = useState({
    feeling: '',
    control:{
      choose: false
    }
     
  })
  const wnapp = useSelector((state) => state.apps.feedback);
  const user = useSelector((state) => state.user);
  const userName = user?.email ?? "Admin";
  const { t, i18n } = useTranslation();

  const handleSelectFeeling = (feeling)=>{
    setSelector(prev => ({...prev, feeling}))
  }
  const handleSelectErr = (err) =>{
    setSelector(prev => {
      return ({
        ...prev, 
        [err]:{...prev[err], choose: !prev[err]?.choose}})
    })

  }
  const submitFeedback = ()=>{

    console.log(selector);
  }
  const isSelector = (key) => {
    
    return {
      opacity: selector[key]?.choose ? 1 : 0.5
    }
  }
  return (
    <div
      className="calcApp floatTab dpShad feedbackApp"
      data-size={wnapp.size =="full" ? 'mini' : wnapp.size }
      id={wnapp.icon + "App"}
      data-max={wnapp.max}
      style={{
        ...(wnapp.size == "cstm" ? wnapp.dim : null),
        zIndex: wnapp.z,
      }}
      data-hide={wnapp.hide}
    >
      <ToolBar
        app={wnapp.action}
        icon={wnapp.icon}
        size={wnapp.size}
        name="FeedBack"
      />
      <div className="windowScreen flex flex-col p-[12px]" data-dock="true">
        <div className="flex p-2 items-center justify-between">
            {listFeedBack.map(icon => (
              <div style={{opacity: icon.value == selector.feeling ? 1 : 0.5}} onClick={()=>{handleSelectFeeling(icon.value)}} className="flex flex-col items-center">
                <div  className="flex rounded-[100%] border-gray-400 border-solid border bg-gray-200 w-max ">
                  <img data-select={icon.value == selector.feeling} src={icon.src} className='icon' />
                </div>
                <p className="text-[12px]">{icon.name}</p>
              </div>
            )
              )}
        </div>
        <hr className="my-[6px]"/>
        <p className="text-[14px]">Bạn gặp vấn đề với:</p>
        <div className="flex flex-wrap gap-1 justify-between mt-2">
          {
            listErr.map(err=>(
              <div style={isSelector(err.value)} onClick={()=>{handleSelectErr(err.value)}} className="p-1 text-center rounded-full border border-solid border-gray-700 ] text-[12px]">
                {err.name}
              </div>
            ))
          }
        </div>
        <div className="flex flex-wrap gap-1 my-2">
          {
            listErr.map(err=>{
              if(selector[err.value]?.choose ==true){
               return err.data.map(detail =>{
                return(
                  <div style={isSelector(detail.value)} onClick={()=>{handleSelectErr(detail.value)}} className="p-1 m-auto text-center rounded-full border border-solid border-gray-700 ] text-[12px]">
                    {detail.name}
                  </div>
                )
               })
              }
             
            })
          }
        </div>
        <p className="text-[14px] mb-2">Chi Tiết:</p>
        <div className="border-solid border h-full rounded-md">
          <textarea className="noteText" ></textarea>
        </div>
        <button className="mt-4 mx-auto instbtn w-[120px] h-[40px]" onClick={()=>{submitFeedback()}}>Submit</button>
      </div>
    </div>
  );
};
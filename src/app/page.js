"use client"
import { IoIosSave } from "react-icons/io"; 
import { GoGrabber } from "react-icons/go";
import { HiMiniArrowsRightLeft, HiPencil } from "react-icons/hi2";
import { BiSolidEraser } from "react-icons/bi";
import "./page.css"
import { useEffect, useRef, useState } from "react";
import Draggable from "react-draggable";
import { Bounce, toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import jsPDF from "jspdf";
import html2canvas from "html2canvas";


function ToolTip({children}){
  return(
    <>
      {children}
    </>
  )
}




export default function Home() {
  const CanvasRef = useRef(null)

  const [sizePencil , setsizePencil] = useState(5)
  const [pos , setpos] = useState({x:0 , y:0})
  const [selectedColor, setselectedColor] = useState("rgb(0,0,0)")
  const [lastselectedColor, setlastselectedColor] = useState()
  const [isDrawing , setisDrawing] = useState(false)
  const [lastPosition, setLastPosition] = useState(null);
  const [isErasing , setisErasing] = useState(false)
  const [scaleN , setscaleN] = useState(1) 


  const notify = () => {
    toast.success('Cor copiada', {
      position: "bottom-left",
      autoClose: 600,
      hideProgressBar: true,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
      theme: "dark",
      transition: Bounce,
      });
  }
  
  const ClosePallet = ()=>{
    const c = document.getElementById("colors")
    const a = document.getElementById("ActionsButtons")
    const d = document.getElementById("divisor")
    c.classList.toggle("none")
    if(c.classList.contains("none")){
      c.style.display = "none"
    }else{
      c.style.display = "flex"
    }
    a.classList.toggle("close")
    d.classList.toggle("close")
  }
  const RandomColors = (element) =>{ 
    const rgb = {
      n1:null,
      n2:null,
      n3:null
    }
    for(let i = 0 ; element.length > i ; i++){
      Object.keys(rgb).map(pos => {
        rgb[pos] = Math.floor(Math.random()*256)
      })
      element[i].style.background = `rgb(${rgb.n1},${rgb.n2},${rgb.n3})`
      element[i]. dataset.value = `${rgb.n1},${rgb.n2},${rgb.n3}`
      element[i].classList.add("Changed")
    }
  }
  

  const draw = (x , y) => {
    const canvas = CanvasRef.current
    const cpx = canvas.getContext("2d")
    cpx.beginPath();
    cpx.lineJoin = "round"
    cpx.lineCap = "round"
    if(isDrawing){
      cpx.strokeStyle  = `rgb(${selectedColor})`
    }
    if(isErasing){
      cpx.strokeStyle  = `rgb(${document.getElementById("whiteBoard").style.backgroundColor})`
    }
    
    cpx.lineWidth = sizePencil;
    if(lastPosition){
      cpx.moveTo(lastPosition.x, lastPosition.y);
      cpx.lineTo(x, y)
      cpx.stroke( );
    }else{
      cpx.moveTo(x, y);
      cpx.lineTo(x, y)
      cpx.stroke( );
    }
    setLastPosition({x,y})
  }

  const Start = (e) => {
    setpos({x:e.clientX , y:e.clientY})
    setisDrawing(true)
    if(isErasing){
      setisDrawing(true)
      draw(pos.x,pos.y);
    }
    draw(pos.x,pos.y);
    
  }
  const DrawStarted= (e)=>{
    setpos({x:e.clientX , y:e.clientY})
    if(isDrawing){
      draw(pos.x , pos.y);
    }
  }
  const Stop = ()=>{
    if(isErasing){
      setselectedColor(lastselectedColor)
    }
    setisDrawing(false)
    setisErasing(false)
    setLastPosition(null)
  }
 const Apagando = () => {
  setlastselectedColor(selectedColor)
  setisErasing(true)
  setselectedColor("255,255,255")
 }

 const savePDF = ()=>{
  const canvas = CanvasRef.current
  html2canvas(canvas).then(can=>{
    
    let POrL = "l"
    if(can.width < can.height){
      console.log('largura menor que altura')
      POrL = "p"
    }
    
    const imgData = can.toDataURL("image/png")
    const pdf = new jsPDF({format:[can.width , can.height] , orientation:POrL})
    const widthOfImage = can.width 
    const HeightOfImage = can.height 
    

    pdf.addImage(imgData , 0 , 0 , widthOfImage , HeightOfImage)
    pdf.save()
  })
 }


 

  document.addEventListener("DOMContentLoaded" ,()=>{
    document.querySelector("canvas").style.width = document.getElementById("whiteBoard").offsetWidth
    document.querySelector("canvas").style.height = document.getElementById("whiteBoard").offsetHeight
  } )

  return (
    <div id="whiteBoard" style={isErasing ? {cursor:"cell"} : {}}>
      
          <canvas  width={document.getElementById("whiteBoard") ? document.getElementById("whiteBoard").offsetWidth :  2000} height={document.getElementById("whiteBoard") ? document.getElementById("whiteBoard").offsetHeight : 2000}
            onMouseDown={Start}
            onMouseMove={DrawStarted}
            onMouseUp={Stop}
            onMouseLeave={Stop}
            ref={CanvasRef}
          >
          
          </canvas>
      <Draggable handle="#Pallete" bounds="#whiteBoard">
      <div id="Pallete">
        <div id="colors">
          <div className="circleColor" id="PrimeiraCor" onMouseDown={(e)=>{
            if(e.target.dataset.value){
              setselectedColor(e.target.dataset.value)
            } 
          }}/>
          <div className="circleColor" onMouseDown={(e)=>{
            if(e.target.dataset.value){
              setselectedColor(e.target.dataset.value)
            } 
          }} />
          <div className="circleColor" onMouseDown={(e)=>{
            if(e.target.dataset.value){
              setselectedColor(e.target.dataset.value)
            } 
          }}/>
          <div className="circleColor" onMouseDown={(e)=>{
            if(e.target.dataset.value){
              setselectedColor(e.target.dataset.value)
            } 
          }}/>
          <div id="RandomColors" onMouseDown={()=>{
            const n = document.querySelectorAll(".circleColor")
            RandomColors(n)
            }}><HiMiniArrowsRightLeft/></div>
        </div>
        
        <hr id="divisor"/>
        <div id="ActionsButtons" >
          <div className="Actions"><HiPencil /></div>

          <div className="Actions"><BiSolidEraser onMouseDown={()=>{
            Apagando()
          }}/></div>
          <div className="Actions" onMouseDown={()=>{
            savePDF()
          }}><IoIosSave /></div>
        </div>
        <div >
          
            <GoGrabber id="GrabLocal" onDoubleClick={()=>{
              ClosePallet()
            }} className="handle"/>
        
          <div id="ActualColor"  style={{background:`rgb(${selectedColor})`}} onMouseDown={(e)=>{
            const rgb = e.target.style.background
            navigator.clipboard.writeText(rgb)
            notify()
            
          }}/>
        
        
        </div>
        </div>
        
      </Draggable>
        <ToastContainer limit={1}/>
    </div>
  );
}

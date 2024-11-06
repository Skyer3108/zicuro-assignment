import { Editor, EditorState,
    RichUtils,
    ContentState,
    Modifier,
    convertToRaw,
    convertFromRaw, } from "draft-js"
import { useEffect, useState } from "react"

const customStyleMap = {
    RED: {
      color:"red",
    },
    UNDERLINE: { textDecoration: "underline" }
  };


const DraftEditor=()=>{


const [editorState,setEditorState]=useState(() =>
    EditorState.createEmpty())


//funtion to handel formating on space key press

const handleKeyCommand=(command)=>{

    const newState=RichUtils.handleKeyCommand(editorState,command)

    if(newState){
        setEditorState(newState)
        return "handled"
    }
    return "not-handled"

}



const handleBeforeInput=(chars)=>{

    const currentContent=editorState.getCurrentContent()
    const selection=editorState.getSelection();

    const block=currentContent.getBlockForKey(selection.getStartKey())

    const text=block.getText();

//Check for speccila formating characcters and apply styles

if(text.startsWith("# ")&&chars==" "){
    setEditorState(applyBlockStyle("header-one","# "))
    return "handled"
}
else if(text.startsWith("* ")&&chars===" "){
    setEditorState(applyStyle("BOLD", "* "));
      return "handled";
}
else if (text.startsWith("** ") && chars === " ") {
    setEditorState(applyStyle("RED", "** "));
    return "handled";
  } 

  else if (text.startsWith("*** ") && chars === " ") {
    setEditorState(applyStyle("UNDERLINE", "*** "));
    return "handled";
  }
  return "not-handled";

}


const applyBlockStyle=(blockType,symbol)=>{
    const currentContent = editorState.getCurrentContent();
    const selection = editorState.getSelection();
    const newContent = Modifier.replaceText(
      currentContent,
      selection.merge({
        anchorOffset: 0,
        focusOffset: symbol.length,
      }),
      ""
    );

    const newState = EditorState.push(editorState, newContent, "remove-range");
    return RichUtils.toggleBlockType(newState, blockType);
}

const applyStyle = (style, symbol) => {
    const currentContent = editorState.getCurrentContent();
    const selection = editorState.getSelection();
    const newContent = Modifier.replaceText(
      currentContent,
      selection.merge({
        anchorOffset: 0,
        focusOffset: symbol.length,
      }),
      ""
    );

    const newState = EditorState.push(
      editorState,
      newContent,
      "remove-range"
    );
    return RichUtils.toggleInlineStyle(newState, style);
  };




   



    //if we have the data in the editor before we have to get that data from the localstorage if the data was present

    useEffect(()=>{

        const saveData=localStorage.getItem("saveContent")

        if(saveData){

            const content=convertFromRaw(JSON.parse(saveData))
            setEditorState(EditorState.createWithContent(content))
        }
    },[])


    //Saving content to localStorage
    const saveContent=()=>{

        const content=editorState.getCurrentContent()

        const rawContent=convertToRaw(content)

        localStorage.setItem('saveContent',JSON.stringify(rawContent))


    }


   return(
    <div style={{ padding: "20px",  margin: "auto", }}>

        <h2 style={{textAlign:'center'}}>Editor</h2>

<div style={{display:'flex',justifyContent:"flex-end"}}>
<button  style={{width:'100px',fontSize:"15px",fontWeight:"bold"}} onClick={saveContent}>Save</button>

</div>


        <div style={{border:"2px solid aqua",
        borderRadius:"10px",
        padding:"10px",
        minHeight:'500px',
        marginTop:"10px"
        }}>


            <Editor
            editorState={editorState}
            handleKeyCommand={handleKeyCommand}

            onChange={setEditorState}


            handleBeforeInput={handleBeforeInput}
            customStyleMap={customStyleMap}
            />

        </div>

    </div>
   ) 
}

export default DraftEditor
import React, { useRef } from 'react';
import { View, Button } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { RichEditor } from 'react-native-pell-rich-editor';
import * as FileSystem from 'expo-file-system';

const RichTextWithImagePaste = () => {
  const editorRef = useRef();

  const handlePaste = async (text) => {
    console.log("text",text);
    
    const clipboardContent = await Clipboard.getStringAsync()
    if(clipboardContent){
      console.log(clipboardContent);
      try {
        const fileInfo = await FileSystem.getInfoAsync(clipboardContent);
        console.log("fileInfo",fileInfo);
      } catch (error) {
        console.log("err",error);
        
      }

      
      // await Clipboard.getStringAsync("")
    }

    // if (clipboardContent.startsWith('data:image') || clipboardContent.match(/\.(jpeg|jpg|gif|png)$/)) {
    //   editorRef.current.insertImage(clipboardContent);
    // } else {
    //   editorRef.current.insertText(clipboardContent);
    // }
  };

  return (
    <View style={{flex:1,paddingTop:100}}>
      <RichEditor ref={editorRef} onChange={handlePaste} style={{ minHeight: 150,borderWidth:1,width:"100%" }} />
      <Button title="Paste" onPress={handlePaste} />
    </View>
  );
};

export default RichTextWithImagePaste;

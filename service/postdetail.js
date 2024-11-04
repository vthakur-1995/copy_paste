import axios from "axios";

export const makeAPIRequest = async (url) => {
    try {
    //   const cancelToken = fn();
      const response = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          Accept: 'application/json',
          'x-api-username':` userApiKey-246805-TinJNjgOxWm6INM0fI0mcOTG5iIBzQcY`,
          'User-Agent':'Community by Website Toolbox mobile app/3.2.63 (android 11, sdk_gphone_x86,null)' ,
          'x-api-key': 'x-api-username user API key',
        },
        // cancelToken: cancelToken,
      });
  
      return response.data;
    } catch (error) {
        console.log("er",error);
        
    //   if (true) {
    //   } else {
    //     return error;
    //   }
    }
  };
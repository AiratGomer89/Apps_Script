function mistral_AI_API_agents_with_SystemRole(question, agent_id, systemRole = ''){

  try{
    let mistral_key = '***YOUR_MISTRAL_API_KEY***';

    let data = {
      method: "post",
      headers: {
        Authorization: 'Bearer ' + mistral_key,
        'Content-Type': 'application/json',
      },
      payload: JSON.stringify({
        messages: [ 
          {
            "role":"system",
            "content":systemRole
          },       
          {
            "role": "user",
            "content": question
          }
        ],        
        stream: false,        
        agent_id: agent_id,
        //max_tokens: 100,        
      }),
      muteHttpExceptions: true,
    };
    
    let response = UrlFetchApp.fetch('https://api.mistral.ai/v1/agents/completions', data);    
    let responseJSON = JSON.parse(response.getContentText());
    let text = responseJSON.choices[0].message.content;
    
    return text; 

  }catch(error){
    return error;
  }

}

function mistral_AI_API(question, systemRole = '', temperature = 0.7){

  try{
    let mistral_key =  '***YOUR_MISTRAL_API_KEY***';

    let data = {
      method: "post",
      headers: {
        Authorization: 'Bearer ' + mistral_key,
        'Content-Type': 'application/json',
      },
      payload: JSON.stringify({
        messages: [        
          {
            "role":"system",
            "content":systemRole
          },
          {
            "role": "user",
            "content": question
          }
        ],
        model: "mistral-large-latest",
        stream: false,
        temperature: temperature,
        
        //parse_mode: "HTML",
        //max_tokens: 1000,
      }),
      muteHttpExceptions: true,
    };
    
    
    let response = UrlFetchApp.fetch('https://api.mistral.ai/v1/chat/completions', data);
    let responseJSON = JSON.parse(response.getContentText());
    let text = responseJSON.choices[0].message.content;
    
    return text; 

  }catch(error){
    return error;
  }

}

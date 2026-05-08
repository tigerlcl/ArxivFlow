import axios from "axios";
export const BASE_URL = "https://api.dify.ai/v1";

export const routes = {
  //  app's
  feedback: {
    method: "POST",
    url: (message_id) => `/messages/${message_id}/feedbacks`,
  },
  application: {
    method: "GET",
    url: () => `/parameters`,
  },
  fileUpload: {
    method: "POST",
    url: () => `/files/upload`,
  },
  textToAudio: {
    method: "POST",
    url: () => `/text-to-audio`,
  },
  getMeta: {
    method: "GET",
    url: () => `/meta`,
  },

  // completion's
  createCompletionMessage: {
    method: "POST",
    url: () => `/completion-messages`,
  },

  // chat's
  createChatMessage: {
    method: "POST",
    url: () => `/chat-messages`,
  },
  getSuggested:{
    method: "GET",
    url: (message_id) => `/messages/${message_id}/suggested`,
  },
  stopChatMessage: {
    method: "POST",
    url: (task_id) => `/chat-messages/${task_id}/stop`,
  },
  getConversations: {
    method: "GET",
    url: () => `/conversations`,
  },
  getConversationMessages: {
    method: "GET",
    url: () => `/messages`,
  },
  renameConversation: {
    method: "POST",
    url: (conversation_id) => `/conversations/${conversation_id}/name`,
  },
  deleteConversation: {
    method: "DELETE",
    url: (conversation_id) => `/conversations/${conversation_id}`,
  },
  audioToText: {
    method: "POST",
    url: () => `/audio-to-text`,
  },

  // workflow‘s
  getWorkflowInfo: {
    method: "GET",
    url: () => `/info`,
  },
  runWorkflow: {
    method: "POST",
    url: () => `/workflows/run`,
  },
  stopWorkflow: {
    method: "POST",
    url: (task_id) => `/workflows/${task_id}/stop`,
  },
  getWorkflowResult: {
    method: "GET",
    url: (task_id) => `/workflows/run/${task_id}`,
  },

};

export class DifyClient {
  constructor(apiKey, baseUrl = BASE_URL) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  updateApiKey(apiKey) {
    this.apiKey = apiKey;
  }

  async sendRequest(
    method,
    endpoint,
    data = null,
    params = null,
    stream = false,
    headerParams = {}
  ) {
    const headers = {
      ...{
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      ...headerParams
    };

    const url = `${this.baseUrl}${endpoint}`;
    let response;
    if (stream) {
      response = await axios({
        method,
        url,
        data,
        params,
        headers,
        responseType: "stream",
      });
    } else {
      response = await axios({
        method,
        url,
        ...(method !== "GET" && { data }),
        params,
        headers,
        responseType: "json",
      });
    }

    return response;
  }

  messageFeedback(message_id, rating, user) {
    const data = {
      rating,
      user,
    };
    return this.sendRequest(
      routes.feedback.method,
      routes.feedback.url(message_id),
      data
    );
  }

  getApplicationParameters(user) {
    const params = { user };
    return this.sendRequest(
      routes.application.method,
      routes.application.url(),
      null,
      params
    );
  }

  fileUpload(data) {
    return this.sendRequest(
      routes.fileUpload.method,
      routes.fileUpload.url(),
      data,
      null,
      false,
      {
        "Content-Type": 'multipart/form-data'
      }
    );
  }

  textToAudio(text, user, streaming = false) {
    const data = {
      text,
      user,
      streaming
    };
    return this.sendRequest(
      routes.textToAudio.method,
      routes.textToAudio.url(),
      data,
      null,
      streaming
    );
  }

  getMeta(user) {
    const params = { user };
    return this.sendRequest(
      routes.meta.method,
      routes.meta.url(),
      null,
      params
    );
  }
}

export class CompletionClient extends DifyClient {
  createCompletionMessage(inputs, user, stream = false, files = null) {
    const data = {
      inputs,
      user,
      response_mode: stream ? "streaming" : "blocking",
      files,
    };
    return this.sendRequest(
      routes.createCompletionMessage.method,
      routes.createCompletionMessage.url(),
      data,
      null,
      stream
    );
  }

  runWorkflow(inputs, user, stream = false, files = null) {
    const data = {
      inputs,
      user,
      response_mode: stream ? "streaming" : "blocking",
    };
    return this.sendRequest(
      routes.runWorkflow.method,
      routes.runWorkflow.url(),
      data,
      null,
      stream
    );
  }
}

export class ChatClient extends DifyClient {
  createChatMessage(
    inputs,
    query,
    user,
    stream = false,
    conversation_id = null,
    files = null
  ) {
    const data = {
      inputs,
      query,
      user,
      response_mode: stream ? "streaming" : "blocking",
      files,
    };
    if (conversation_id) data.conversation_id = conversation_id;

    return this.sendRequest(
      routes.createChatMessage.method,
      routes.createChatMessage.url(),
      data,
      null,
      stream
    );
  }

  getSuggested(message_id, user) {
    const data = { user };
    return this.sendRequest(
      routes.getSuggested.method,
      routes.getSuggested.url(message_id),
      data
    );
  }

  stopMessage(task_id, user) {
    const data = { user };
    return this.sendRequest(
      routes.stopChatMessage.method,
      routes.stopChatMessage.url(task_id),
      data
    );
  }

  getConversations(user, first_id = null, limit = null, pinned = null) {
    const params = { user, first_id: first_id, limit, pinned };
    return this.sendRequest(
      routes.getConversations.method,
      routes.getConversations.url(),
      null,
      params
    );
  }

  getConversationMessages(
    user,
    conversation_id = "",
    first_id = null,
    limit = null
  ) {
    const params = { user };

    if (conversation_id) params.conversation_id = conversation_id;

    if (first_id) params.first_id = first_id;

    if (limit) params.limit = limit;

    return this.sendRequest(
      routes.getConversationMessages.method,
      routes.getConversationMessages.url(),
      null,
      params
    );
  }

  renameConversation(conversation_id, name, user, auto_generate) {
    const data = { name, user, auto_generate };
    return this.sendRequest(
      routes.renameConversation.method,
      routes.renameConversation.url(conversation_id),
      data
    );
  }

  deleteConversation(conversation_id, user) {
    const data = { user };
    return this.sendRequest(
      routes.deleteConversation.method,
      routes.deleteConversation.url(conversation_id),
      data
    );
  }


  audioToText(data) {
    return this.sendRequest(
      routes.audioToText.method,
      routes.audioToText.url(),
      data,
      null,
      false,
      {
        "Content-Type": 'multipart/form-data'
      }
    );
  }

}

export class WorkflowClient extends DifyClient {
  run(inputs,user,stream) {
    const data = {
      inputs,
      response_mode: stream ? "streaming" : "blocking",
      user
    };

    return this.sendRequest(
        routes.runWorkflow.method,
        routes.runWorkflow.url(),
        data,
        null,
        stream
    );
  }

  stop(task_id, user) {
    const data = { user };
    return this.sendRequest(
      routes.stopWorkflow.method,
      routes.stopWorkflow.url(task_id),
      data
    );
  }
  info(user) {
    const params = { user };
    return this.sendRequest(
      routes.getWorkflowInfo.method,
      routes.getWorkflowInfo.url(),
      null,
      params
    );
  }
  result(task_id) {
    return this.sendRequest(
      routes.getWorkflowResult.method,
      routes.getWorkflowResult.url(task_id),
      null
    );
  }
  async getWorkflowResult(input, user, isStream) {
    const res = await this.run(input, user, isStream)
    function unicodeToChar(text) {
        if (!text)
          return ''

        return text.replace(/\\u[0-9a-f]{4}/g, (_match, p1) => {
          return String.fromCharCode(parseInt(p1, 16))
        })
      }
    const asyncSSE = (stream) => {
        return new Promise((resolve, reject) => {
          let task_id = ''
          try {
            stream.on('data', data => {
              const streams = new TextDecoder('utf-8').decode(data, { stream: true }).split('\n')
              streams.forEach(stream => {
                if (stream && stream.startsWith('data: ')) {
                  let res = {}
                  try {
                    res = JSON.parse(stream.substring(6)) || {}
                  } catch (e) {
                    return
                  }

                  if (!res.event || res.event === 'error' || res.status === 400) {
                    console.log(`Workflow output error code: ${res.code}`, res.message)
                    return
                  }
                  if (res.event === 'workflow_started' || res.event === 'tts_message') {
                      task_id = res?.workflow_run_id
                      console.log('Workflow started executing')
                  }
                  if (res.event === 'node_started' || res.event=== 'node_finished') {
                    task_id = res?.workflow_run_id
                    console.log('Workflow node executing tasks')
                  }
                  if (res.event === 'workflow_finished' || res.event === 'tts_message_end') {
                    console.log('Workflow execution completed, assembling data for sending')
                    task_id = res?.workflow_run_id
                  }
                }
              })
            })
            stream.on('end', async () => {

              const { data } = task_id ? await this.result(task_id) : { data: { outputs: '' } }
              console.log('Getting workflow execution results', task_id, JSON.stringify(data.outputs))
              let outputs = {}
              if(data.outputs) {
                  try {
                    outputs = JSON.parse(data.outputs)
                  } catch (error) {
                    console.log(`Failed to get workflow execution results: ${error}`)
                  }
              }

              resolve({ text: outputs?.text, task_id: task_id })
            })
          } catch (e) {
            resolve({ text: `Dify workflow execution error: ${e}`, task_id: '' })
          }
        })
    }
    if (!isStream) {
      if (res.data.code) {
        console.log('Dify workflow execution failed', res.data.code, res.data.message)
        return Promise.reject(res.message)
      }
      const response = res.data
      return {
            text: response?.data?.outputs?.text || '',
            task_id: response?.task_id,
          }
    } else {
        console.log('Entering Dify workflow, please wait...')
        const result = await asyncSSE(res.data)
        return result
    }
  }
}
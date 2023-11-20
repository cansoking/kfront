<template>
  <div class="ssharea">
    <label for="node-select">请选择要远程连接的节点：</label>
    <el-select  id="node-select" v-model="options.host" placeholder="Select an Node">
      <el-option v-for="node in nodes" :label="node.name" :key="node.ip" :value="node.ip">{{ node.name }} - {{ node.ip }}</el-option>
    </el-select>
    <el-container style="height: 100vh; margin-top: 20px">
            <div id="terminal" style="width: 100%; height: 100%"></div>
    </el-container>
  </div>
</template>


<script>

import { Terminal } from 'xterm';
import "xterm/css/xterm.css";
import { FitAddon } from "xterm-addon-fit";


function WSSHClient() {
  this._connection = null;
}

WSSHClient.prototype._generateEndpoint = function (options) {
  const protocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
  return protocol +  options.host+ ':8080/webssh';
};

WSSHClient.prototype.connect = function (options) {
  const endpoint = this._generateEndpoint(options);

  if (this._connection) {
    this._connection.close();
    this._connection = null;
  }

  if (window.WebSocket) {
    this._connection = new WebSocket(endpoint);
  } else {
    options.onError('WebSocket Not Supported');
    return;
  }

  this._connection.onopen = function () {
    // The connection is opened, now we can send data.
    options.onConnect();
  };

  this._connection.onmessage = function (evt) {
    const data = evt.data.toString();
    options.onData(data);
  };

  this._connection.onclose = function (evt) {
    options.onClose();
  };
};

WSSHClient.prototype.close =function (){
  if(this._connection){
    this._connection.close();
    this._connection = null;
  }
}

WSSHClient.prototype.send = function (data) {
  this._connection.send(JSON.stringify(data));
};

WSSHClient.prototype.sendInitData = function (options) {
  this._connection.send(JSON.stringify(options));
};

WSSHClient.prototype.sendClientData = function (data) {
  if (this._connection && this._connection.readyState === WebSocket.OPEN) {
    this._connection.send(JSON.stringify({ "operate": 'command', "command": data }));
  } else {
    console.error('WebSocket connection is not open. Data cannot be sent.');
  }
};


export default {
  name: "WebSSH",
  data() {
    return {
      nodes: [
        { name: 'Master 1', ip: '192.168.91.129' },
        { name: 'Worker 1', ip: '192.168.157.211' },
        { name: 'Worker 2', ip: '192.168.157.212' },
        { name: 'Worker 3', ip: '192.168.157.213' },
        { name: 'Worker 4', ip: '192.168.157.214' },
        { name: 'Worker 5', ip: '192.168.157.215' },
        { name: 'Worker 6', ip: '192.168.157.216' },
        { name: 'Worker 7', ip: '192.168.157.217' },
      ],
      terminal: null,
      wsshClient: new WSSHClient(),
      options:{
        operate:'connect',
        host: '192.168.91.129',//IP
        port: '22',//ssh default  port
        username: 'abc',//
        password: 'ko687168'//
      }
    };
  },
  watch: {
    'options.host':function (newHost,oldHost){
      this.options.host=newHost;
      if (this.terminal) {
        this.terminal.dispose(); // dispose the old terminal instance
        this.terminal = null;
      }
      this.wsshClient.close();
      setTimeout(() => {
        this.openTerminal(this.options); // open a new terminal with the new options
      }, 1000);
    }
  },
  mounted() {
    this.openTerminal(this.options);
  },
  methods: {
    openTerminal(options) {
      this.terminal = new Terminal({
        rendererType: "canvas",
        convertEol: true,
        fontSize: 20,
        disableStdin: false,
        //cols: 97,
        rows: 37,
        cursorBlink: true,
        cursorStyle: 'block',
        scrollback: 800,
        tabStopWidth: 8,
        screenKeys: true,
        theme: {
          foreground: "yellow",
          background: "#060101",
          cursor: "help"
        }

      });

      var fitAddon = new FitAddon();
      this.terminal.loadAddon(fitAddon);
      fitAddon.fit();

      this.terminal.onData((data) => {
        this.wsshClient.sendClientData(data);
      });

      this.terminal.open(document.getElementById('terminal'));
      this.terminal.write('Connecting...');

      this.wsshClient.connect({
        onConnect: () => {
          this.wsshClient.sendInitData(options);
          // Do something on connection
        },
        onData: (data) => {
          // Handle data received from the server
          this.terminal.write(data);
        },
        onClose: () => {
          // Handle connection close
          if (this.terminal) {
            this.terminal.write("\rconnection closed");
          } else {
            console.error('Terminal is null. Cannot write to terminal.');
          }
        },
        onError: (error) => {
          this.terminal.write("Error:"+error+'\r\n');
        },
        host: options.host,
      });
    },
  },
};
</script>

<style scoped lang="scss">
.ssharea {
  background-color: #fff;
  border-radius: 5px;
  padding: 20px;
  margin-top: 15px;
}
::v-deep .xterm-screen{
  height: 100vh!important;
}
::v-deep .node-select {
  margin-bottom: 100px;
}
</style>
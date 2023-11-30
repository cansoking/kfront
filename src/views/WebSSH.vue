<template>
  <div class="ssharea">
    <el-card class="info-card">
      <label for="node-select">请选择要远程连接的节点：</label>
      <el-select id="node-select" v-model="selectedNode" placeholder="选择一个节点">
        <el-option
            v-for="node in nodes"
            :label="`${node.name} - ${node.ip}`"
            :key="node.ip"
            :value="node.ip"
        ></el-option>
      </el-select>
      <el-container :style="{ height: '80vh', marginTop: '20px' }">
        <div id="terminal" style="width: 100%; height: 100%"></div>
      </el-container>
    </el-card>
  </div>
</template>

<script>
import { Terminal } from 'xterm';
import "xterm/css/xterm.css";
import { FitAddon } from "xterm-addon-fit";


const WS_PATH = '/webssh';
const WS_PORT = 8080;
class WSSHClient {


  constructor() {
    this._connection = null;
  }

  _generateEndpoint(options) {
    const protocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
    return `${protocol}${options.host}:${WS_PORT}${WS_PATH}`;
  }

  connect(options) {
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

    this._connection.onerror = () => {
      options.onError('\rWebSocket Connection Error');
    };

    this._connection.onopen = () => {
      options.onConnect();
    };

    this._connection.onmessage = (evt) => {
      const data = evt.data.toString();
      options.onData(data);
    };

    this._connection.onclose = () => {
      options.onClose();
    };
  }

  close() {
    if (this.terminal) {
      this.terminal.dispose();
      this.terminal = null;
    }

    if (this._connection) {
      this._connection.close();
      this._connection = null;
    }
  }

  send(data) {
    this._connection?.send(JSON.stringify(data));
  }

  sendInitData(options) {
    this._connection?.send(JSON.stringify(options));
  }

  sendClientData(data) {
    this._connection?.readyState === WebSocket.OPEN
        ? this._connection.send(JSON.stringify({ "operate": 'command', "command": data }))
        : console.error('WebSocket connection is not open. Data cannot be sent.');
  }
}

export default {
  name: "WebSSH",
  data() {
    return {
      nodes: [
        { name: 'Master 1', ip: '39.98.124.97' },
        { name: 'Worker 1', ip: '39.101.136.242' },
        { name: 'Worker 2', ip: '39.98.109.31' },
        { name: 'Worker 3', ip: '39.99.252.93' },
        { name: 'Worker 4', ip: '192.168.157.214' },
        { name: 'Worker 5', ip: '192.168.157.215' },
        { name: 'Worker 6', ip: '192.168.157.216' },
        { name: 'Worker 7', ip: '192.168.157.217' },
        { name: 'vm', ip: '192.168.243.143' },
        { name: 'vmRemote', ip: '192.168.243.145' },
      ],
      terminal: null,
      wsshClient: new WSSHClient(),
      options: {
        operate: 'connect',
        host: '39.98.124.97', // IP
        port: '22', // ssh default port
        username: 'root',
        password: 'Upc123456@',
      },
      selectedNode: '',
      isFirstSet: true,
      terminalReady: false,
    };
  },
  watch: {
    'selectedNode'(newHost) {
      if (this.isFirstSet) {
        this.isFirstSet = false;
      } else {
        this.$confirm('确定要切换到'+newHost+'并中断当前操作吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          this.options.host = newHost;
          this.wsshClient.close();
          this.terminalReady = false;
          if (this.terminal) {
            this.terminal.dispose();
          }
          setTimeout(() => {
            this.openTerminal(this.options);
          }, 1000);
        }).catch(() => {
          // do nothing
        });
      }
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.selectedNode = this.options.host;
      this.openTerminal(this.options);
    });
  },
  methods: {
    openTerminal(options) {
      this.terminal = new Terminal({
        rendererType: "canvas",
        convertEol: true,
        fontSize: 20,
        disableStdin: false,
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

      const fitAddon = new FitAddon();
      this.terminal.loadAddon(fitAddon);
      fitAddon.fit();

      this.terminal.onData((data) => {
        if (this.terminalReady) {
          this.wsshClient.sendClientData(data);
        }
      });

      this.terminal.open(document.getElementById('terminal'));
      this.terminal.write('Connecting...');

      this.wsshClient.connect({
        onConnect: () => {
          this.terminalReady = true;
          this.wsshClient.sendInitData(options);
        },
        onData: (data) => {
          this.terminal.write(data);
        },
        onClose: () => {
          if (this.terminal) {
            this.terminal.write("\rconnection closed");
          } else {
            console.error('Terminal is null. Cannot write to terminal.');
          }
        },
        onError: (error) => {
          this.terminal.write("Error:" + error + '\r\n');
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

::v-deep .xterm-screen {
  height: 80vh !important;
}

::v-deep .node-select {
  margin-bottom: 100px;
}

</style>

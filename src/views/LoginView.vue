<template>
  <div class="BgAnimation">
    <div class="waves"></div>
    <div v-if="page == 0">
      <div class="chead">
        <el-image :src="require('../images/xw.png')" fit="fill" :lazy="true"></el-image>
        <div>基于虚拟化的资源管理技术研究原型软件</div>
      </div>
      <div class="content">
        <div class="login-box">
          <div class="frosted__glass" align="center">
            <div class="logintitle" align="center">登录</div>
            <div class="logincontent">
              <span class="login-label">账号</span>
              <input v-model="username" class="login-input" type="text" /><br />
              <span class="login-label">密码</span>
              <input v-model="password" class="login-input" type="password" />
            </div>
            <el-button @click="login" type="info" plain round class="login-btn">登录</el-button>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="box2">
        <div class="frosted__glass2">
          <div style="margin-left: 30px; margin-top: 25px">
            <el-page-header @back="goBack" :content="names[page - 1] + '详情页面'">
            </el-page-header>
          </div>
          <div class="detaillist">
            <div v-if="sp_nodeinfo[page - 1].length == 0" style="margin-right: 150px; margin-top: 320px">
              暂无{{ names[page - 1] }}节点
            </div>
            <div v-else>
              <div v-for="item in sp_nodeinfo[page - 1]" :key="item.id" style="margin-top: 40px">
                <el-row :gutter="0">
                  <el-col :span="15" :offset="0">
                    <div class="nodename">
                      <i v-if="item.reachable === true" class="el-icon-check"></i>
                      <i v-if="item.reachable === false" class="el-icon-close"></i>
                      {{ item.nodeName }}/{{ item.nodeLocation }}/{{
      item.nodeIp
    }}
                    </div>
                  </el-col>
                  <el-col :span="2" :offset="1">
                    <el-button style="
                        box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
                        width: 60px;
                        height: 60px;
                        font-size: 20px;
                      " type="enterbtn" icon="el-icon-d-arrow-right" circle :disabled="!item.reachable"
                      @click="topage(item)"></el-button>
                  </el-col>
                  <el-col :span="2" :offset="0">
                    <el-popconfirm confirm-button-text="确认删除" cancel-button-text="取消" confirm-button-type="danger"
                      cancel-button-type="info" icon="el-icon-info" icon-color="gray" title="要删除这个节点吗？"
                      @confirm="deletenode(item.id)">
                      <el-button slot="reference" style="
                          box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
                          width: 60px;
                          height: 60px;
                          font-size: 20px;
                        " type="deletebtn" icon="el-icon-delete-solid" circle></el-button>
                    </el-popconfirm>
                  </el-col>
                  <el-col :span="2" :offset="0">
                    <el-button style="
                        box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
                        width: 60px;
                        height: 60px;
                        font-size: 20px;
                      " type="enterbtn" icon="el-icon-stopwatch" circle @click="pingnode(item)"></el-button>
                  </el-col>
                </el-row>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
class ShaderProgram {
  constructor(holder, options = {}) {
    options = Object.assign(
      {
        antialias: false,
        depthTest: false,
        mousemove: false,
        autosize: true,
        side: "front",
        vertex: `
            precision highp float;
    
            attribute vec4 a_position;
            attribute vec4 a_color;
    
            uniform float u_time;
            uniform vec2 u_resolution;
            uniform vec2 u_mousemove;
            uniform mat4 u_projection;
    
            varying vec4 v_color;
    
            void main() {
    
              gl_Position = u_projection * a_position;
              gl_PointSize = (10.0 / gl_Position.w) * 100.0;
    
              v_color = a_color;
    
            }`,
        fragment: `
            precision highp float;
    
            uniform sampler2D u_texture;
            uniform int u_hasTexture;
    
            varying vec4 v_color;
    
            void main() {
    
              if ( u_hasTexture == 1 ) {
    
                gl_FragColor = v_color * texture2D(u_texture, gl_PointCoord);
    
              } else {
    
                gl_FragColor = v_color;
    
              }
    
            }`,
        uniforms: {},
        buffers: {},
        camera: {},
        texture: null,
        onUpdate: () => { },
        onResize: () => { },
      },
      options
    );

    const uniforms = Object.assign(
      {
        time: {
          type: "float",
          value: 0,
        },
        hasTexture: {
          type: "int",
          value: 0,
        },
        resolution: {
          type: "vec2",
          value: [0, 0],
        },
        mousemove: {
          type: "vec2",
          value: [0, 0],
        },
        projection: {
          type: "mat4",
          value: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
        },
      },
      options.uniforms
    );

    const buffers = Object.assign(
      {
        position: {
          size: 3,
          data: [],
        },
        color: {
          size: 4,
          data: [],
        },
      },
      options.buffers
    );

    const camera = Object.assign(
      {
        fov: 60,
        near: 1,
        far: 10000,
        aspect: 1,
        z: 100,
        perspective: true,
      },
      options.camera
    );

    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl", {
      antialias: options.antialias,
    });

    if (!gl) return false;

    this.count = 0;
    this.gl = gl;
    this.canvas = canvas;
    this.camera = camera;
    this.holder = holder;
    this.onUpdate = options.onUpdate;
    this.onResize = options.onResize;
    this.data = {};

    holder.appendChild(canvas);

    this.createProgram(options.vertex, options.fragment);

    this.createBuffers(buffers);
    this.createUniforms(uniforms);

    this.updateBuffers();
    this.updateUniforms();

    this.createTexture(options.texture);

    gl.enable(gl.BLEND);
    gl.enable(gl.CULL_FACE);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    gl[options.depthTest ? "enable" : "disable"](gl.DEPTH_TEST);

    if (options.autosize)
      window.addEventListener("resize", (e) => this.resize(e), false);
    if (options.mousemove)
      window.addEventListener("mousemove", (e) => this.mousemove(e), false);

    this.resize();

    this.update = this.update.bind(this);
    this.time = {
      start: performance.now(),
      old: performance.now(),
    };
    this.update();
  }

  mousemove(e) {
    let x = (e.pageX / this.width) * 2 - 1;
    let y = (e.pageY / this.height) * 2 - 1;

    this.uniforms.mousemove = [x, y];
  }

  resize(e) {
    const holder = this.holder;
    const canvas = this.canvas;
    const gl = this.gl;

    const width = (this.width = holder.offsetWidth);
    const height = (this.height = holder.offsetHeight);
    const aspect = (this.aspect = width / height);
    const dpi = (this.dpi = devicePixelRatio);

    canvas.width = width * dpi;
    canvas.height = height * dpi;
    canvas.style.width = 100 + "%";
    canvas.style.height = 100 + "%";

    gl.viewport(0, 0, width * dpi, height * dpi);
    gl.clearColor(0, 0, 0, 0);

    this.uniforms.resolution = [width, height];
    this.uniforms.projection = this.setProjection(aspect);

    this.onResize(width, height, dpi);
  }

  setProjection(aspect) {
    const camera = this.camera;

    if (camera.perspective) {
      camera.aspect = aspect;

      const fovRad = camera.fov * (Math.PI / 180);
      const f = Math.tan(Math.PI * 0.5 - 0.5 * fovRad);
      const rangeInv = 1.0 / (camera.near - camera.far);

      const matrix = [
        f / camera.aspect,
        0,
        0,
        0,
        0,
        f,
        0,
        0,
        0,
        0,
        (camera.near + camera.far) * rangeInv,
        -1,
        0,
        0,
        camera.near * camera.far * rangeInv * 2,
        0,
      ];

      matrix[14] += camera.z;
      matrix[15] += camera.z;

      return matrix;
    } else {
      return [
        2 / this.width,
        0,
        0,
        0,
        0,
        -2 / this.height,
        0,
        0,
        0,
        0,
        1,
        0,
        -1,
        1,
        0,
        1,
      ];
    }
  }

  createShader(type, source) {
    const gl = this.gl;
    const shader = gl.createShader(type);

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      return shader;
    } else {
      console.log(gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
    }
  }

  createProgram(vertex, fragment) {
    const gl = this.gl;

    const vertexShader = this.createShader(gl.VERTEX_SHADER, vertex);
    const fragmentShader = this.createShader(gl.FRAGMENT_SHADER, fragment);

    const program = gl.createProgram();

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.useProgram(program);
      this.program = program;
    } else {
      console.log(gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
    }
  }

  createUniforms(data) {
    const gl = this.gl;
    const uniforms = (this.data.uniforms = data);
    const values = (this.uniforms = {});

    Object.keys(uniforms).forEach((name) => {
      const uniform = uniforms[name];

      uniform.location = gl.getUniformLocation(this.program, "u_" + name);

      Object.defineProperty(values, name, {
        set: (value) => {
          uniforms[name].value = value;
          this.setUniform(name, value);
        },
        get: () => uniforms[name].value,
      });
    });
  }

  setUniform(name, value) {
    const gl = this.gl;
    const uniform = this.data.uniforms[name];

    uniform.value = value;

    switch (uniform.type) {
      case "int": {
        gl.uniform1i(uniform.location, value);
        break;
      }
      case "float": {
        gl.uniform1f(uniform.location, value);
        break;
      }
      case "vec2": {
        gl.uniform2f(uniform.location, ...value);
        break;
      }
      case "vec3": {
        gl.uniform3f(uniform.location, ...value);
        break;
      }
      case "vec4": {
        gl.uniform4f(uniform.location, ...value);
        break;
      }
      case "mat2": {
        gl.uniformMatrix2fv(uniform.location, false, value);
        break;
      }
      case "mat3": {
        gl.uniformMatrix3fv(uniform.location, false, value);
        break;
      }
      case "mat4": {
        gl.uniformMatrix4fv(uniform.location, false, value);
        break;
      }
    }

    // ivec2       : uniform2i,
    // ivec3       : uniform3i,
    // ivec4       : uniform4i,
    // sampler2D   : uniform1i,
    // samplerCube : uniform1i,
    // bool        : uniform1i,
    // bvec2       : uniform2i,
    // bvec3       : uniform3i,
    // bvec4       : uniform4i,
  }

  updateUniforms() {
    const gl = this.gl;
    const uniforms = this.data.uniforms;

    Object.keys(uniforms).forEach((name) => {
      const uniform = uniforms[name];

      this.uniforms[name] = uniform.value;
    });
  }

  createBuffers(data) {
    const gl = this.gl;
    const buffers = (this.data.buffers = data);
    const values = (this.buffers = {});

    Object.keys(buffers).forEach((name) => {
      const buffer = buffers[name];

      buffer.buffer = this.createBuffer("a_" + name, buffer.size);

      Object.defineProperty(values, name, {
        set: (data) => {
          buffers[name].data = data;
          this.setBuffer(name, data);

          if (name == "position") this.count = buffers.position.data.length / 3;
        },
        get: () => buffers[name].data,
      });
    });
  }

  createBuffer(name, size) {
    const gl = this.gl;
    const program = this.program;

    const index = gl.getAttribLocation(program, name);
    const buffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.enableVertexAttribArray(index);
    gl.vertexAttribPointer(index, size, gl.FLOAT, false, 0, 0);

    return buffer;
  }

  setBuffer(name, data) {
    const gl = this.gl;
    const buffers = this.data.buffers;

    if (name == null && !gl.bindBuffer(gl.ARRAY_BUFFER, null)) return;

    gl.bindBuffer(gl.ARRAY_BUFFER, buffers[name].buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
  }

  updateBuffers() {
    const gl = this.gl;
    const buffers = this.buffers;

    Object.keys(buffers).forEach((name) => (buffers[name] = buffer.data));

    this.setBuffer(null);
  }

  createTexture(src) {
    const gl = this.gl;
    const texture = gl.createTexture();

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      1,
      1,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      new Uint8Array([0, 0, 0, 0])
    );

    this.texture = texture;

    if (src) {
      this.uniforms.hasTexture = 1;
      this.loadTexture(src);
    }
  }

  loadTexture(src) {
    const gl = this.gl;
    const texture = this.texture;

    const textureImage = new Image();

    textureImage.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, texture);

      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        textureImage
      );

      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

      // gl.generateMipmap( gl.TEXTURE_2D )
    };

    textureImage.src = src;
  }

  update() {
    const gl = this.gl;

    const now = performance.now();
    const elapsed = (now - this.time.start) / 5000;
    const delta = now - this.time.old;
    this.time.old = now;

    this.uniforms.time = elapsed;

    if (this.count > 0) {
      gl.clear(gl.COLORBUFFERBIT);
      gl.drawArrays(gl.POINTS, 0, this.count);
    }

    this.onUpdate(delta);

    requestAnimationFrame(this.update);
  }
}

const pointSize = 2.5;

export default {
  name: "IndexView",
  data() {
    return {
      baseurl: "http://39.101.136.242:8080",
      // baseurl: "http://127.0.0.1:8080",
      names: ["中心云", "边缘云", "端"],
      page: 0,
      nodeinfo: [],
      sp_nodeinfo: [],
      c_nodeinfo: [],
      e_nodeinfo: [],
      d_nodeinfo: [],
      username: "",
      password: "",
    };
  },
  methods: {
    // 登录
    login() {
      if (this.username === "" || this.password === "") {
        this.$message({
          message: "请输入用户名和密码",
          type: "error",
        });
      } else {
        this.$axios
          .post(this.baseurl + "/user/login", {
            userName: this.username,
            passwd: this.password,
            userGroupId: 1,
          })
          .then((res) => {
            if (res.data.success) {
              this.$message({
                message: "登录成功",
                type: "success",
              });
              sessionStorage.setItem("islogin", true);
              // sessionStorage.setItem("nodename", 'master1');
              this.$router.replace("/world")
            } else {
              this.$message({
                message: res.data.msg,
                type: "error",
              });
            }
          })
          .catch((err) => {
            console.log("errors", err);
          });
      }
    },
    // 测试节点联通
    pingnode(item) {
      this.$axios
        .get(this.baseurl + "/node/ping?ip=" + item.nodeIp)
        .then((res) => {
          if (res.data === " IP are reachable") {
            this.$set(item, "reachable", true);
            this.$message({
              message: item.nodeName + "可达",
              type: "success",
            });
          } else {
            this.$set(item, "reachable", false);
            this.$message({
              message: item.nodeName + "不可达",
              type: "error",
            });
          }
        })
        .catch((err) => {
          console.log("errors", err);
        });
    },
    // 删除节点
    deletenode(nid) {
      this.$axios
        .delete(this.baseurl + "/node/deleteNodeList1/" + nid)
        .then((res) => {
          if (res.data.success == true) {
            this.$notify.success({
              title: "操作通知",
              message: "节点删除成功",
              position: "bottom-right",
            });
          } else {
            this.$notify.error({
              title: "操作通知",
              message: "节点删除失败",
              position: "bottom-right",
            });
          }
          this.getnodelist();
        })
        .catch((err) => {
          console.log("errors", err);
          this.$notify.error({
            title: "操作通知",
            message: "节点删除失败，请检查网络设置",
            position: "bottom-right",
          });
        });
    },
    getnodelist() {
      // 清空数组
      this.nodeinfo = [];
      this.sp_nodeinfo = [];
      this.c_nodeinfo = [];
      this.e_nodeinfo = [];
      this.d_nodeinfo = [];
      this.$axios
        .get(this.baseurl + "/node/getNodeList1")
        .then((res) => {
          this.nodeinfo = res.data.content;
          // 划分节点
          let tmp_c_count = 0;
          let tmp_e_count = 0;
          let tmp_d_count = 0;
          for (let i = 0; i < this.nodeinfo.length; i++) {
            let item = this.nodeinfo[i];
            if (item.nodeType === "云") {
              this.c_nodeinfo.push(item);
            } else if (item.nodeType === "边") {
              this.e_nodeinfo.push(item);
            } else if (item.nodeType === "端") {
              this.d_nodeinfo.push(item);
            }
          }
          this.sp_nodeinfo.push(this.c_nodeinfo);
          this.sp_nodeinfo.push(this.e_nodeinfo);
          this.sp_nodeinfo.push(this.d_nodeinfo);
        })
        .catch((err) => {
          console.log("errors", err);
        });
    },
    goBack() {
      this.page = 0;
    },
    tempenter() {
      this.$router.push("/podlist");
    },
    topage(node) {
      sessionStorage.setItem("nodename", node.nodeName);
      sessionStorage.setItem("ip", node.nodeIp);
      this.$router.push("/podlist");
    },
  },
  mounted() {
    // 执行
    this.getnodelist();

    const pointSize = 4;

    const waves = new ShaderProgram(document.querySelector(".waves"), {
      texture:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAb1BMVEUAAAD///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8v0wLRAAAAJHRSTlMAC/goGvDhmwcExrVjWzrm29TRqqSKenRXVklANSIUE8mRkGpv+HOfAAABCElEQVQ4y4VT13LDMAwLrUHteO+R9f/fWMfO6dLaPeKVEECRxOULWsEGpS9nULDwia2Y+ALqUNbAWeg775zv+sA4/FFRMxt8U2FZFCVWjR/YrH4/H9sarclSKdPMWKzb8VsEeHB3m0shkhVCyNzeXeAQ9Xl4opEieX2QCGnwGbj6GMyjw9t1K0fK9YZunPXeAGsfJtYjwzxaBnozGGorYz0ypK2HzQSYx1y8DgSRo2ewOiyh2QWOEk1Y9OrQV0a8TiBM1a8eMHWYnRMy7CZ4t1CmyRkhSUvP3gRXyHOCLBxNoC3IJv//ZrJ/kxxUHPUB+6jJZZHrpg6GOjnqaOmzp4NDR48OLxn/H27SRQ08S0ZJAAAAAElFTkSuQmCC",
      uniforms: {
        size: { type: "float", value: pointSize },
        field: { type: "vec3", value: [0, 0, 0] },
        speed: { type: "float", value: 5 },
      },
      vertex: `
        #define M_PI 3.1415926535897932384626433832795
    
        precision highp float;
    
        attribute vec4 a_position;
        attribute vec4 a_color;
    
        uniform float u_time;
        uniform float u_size;
        uniform float u_speed;
        uniform vec3 u_field;
        uniform mat4 u_projection;
    
        varying vec4 v_color;
    
        void main() {
    
          vec3 pos = a_position.xyz;
    
          pos.y += (
            cos(pos.x / u_field.x * M_PI * 8.0 + u_time * u_speed) +
            sin(pos.z / u_field.z * M_PI * 8.0 + u_time * u_speed)
          ) * u_field.y;
    
          gl_Position = u_projection * vec4( pos.xyz, a_position.w );
          gl_PointSize = ( u_size / gl_Position.w ) * 100.0;
    
          v_color = a_color;
    
        }`,
      fragment: `
        precision highp float;
    
        uniform sampler2D u_texture;
    
        varying vec4 v_color;
    
        void main() {
    
          gl_FragColor = v_color * texture2D(u_texture, gl_PointCoord);
    
        }`,
      onResize(w, h, dpi) {
        const position = [],
          color = [];

        const width = 400 * (w / h);
        const depth = 400;
        const height = 3;
        const distance = 5;

        for (let x = 0; x < width; x += distance) {
          for (let z = 0; z < depth; z += distance) {
            position.push(-width / 2 + x, -30, -depth / 2 + z);
            color.push(
              0,
              1 - (x / width) * 1,
              0.5 + (x / width) * 0.5,
              z / depth
            );
          }
        }

        this.uniforms.field = [width, height, depth];

        this.buffers.position = position;
        this.buffers.color = color;

        this.uniforms.size = (h / 400) * pointSize * dpi;
      },
    });

    let socket = new SockJS('/websocket-endpoint');
    let stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
      stompClient.subscribe('/topic/messages', function (message) {
        console.log(message);
      });
    });
    function sendMessage() {
      stompClient.send('/app/send', {}, "asdasd");
    }
  },
};
</script>
<style>
.el-button--deletebtn {
  color: #909399;
  background-color: #fff;
  border-color: #fff;
}

.el-button--deletebtn:focus,
.el-button--deletebtn:hover {
  background: #faecd8;
  border-color: #faecd8;
  color: #b3b4b6;
}

.el-button--deletebtn.is-active,
.el-button--deletebtn:active {
  background: #f56c6c;
  border-color: #f56c6c;
  color: #fff;
}

.el-button--enterbtn {
  color: #909399;
  background-color: #fff;
  border-color: #fff;
}

.el-button--enterbtn:focus,
.el-button--enterbtn:hover {
  background: #f4f4f5;
  border-color: #f4f4f5;
  color: #909399;
}

.el-button--enterbtn.is-active,
.el-button--enterbtn:active {
  background: #b3b4b6;
  border-color: #b3b4b6;
  color: #fff;
}

.login-btn {
  width: 250px;
  height: 40px;
  font-size: 20px;
  line-height: 10px;
  margin-top: 30px;
}

.nodename {
  /* background-color: red; */
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  border-radius: 100px;
  font-size: 35px;
  line-height: 55px;
  letter-spacing: 0.1em;
  height: 60px;
  margin-top: 5px;
  text-align: left;
  padding-left: 30px;
}

.detaillist {
  margin-top: 100px;
  margin-left: 250px;
  margin-right: 100px;
}

.logintitle {
  font-size: 35px;
}

.logincontent {
  margin-left: -50px;
}

.login-label {
  font-size: 20px;
  color: #5e5e5e;
}

.login-box {
  width: 45%;
  margin-left: 26%;
  margin-top: 5%;
}

.login-input {
  height: 35px;
  width: 230px;
  border-radius: 10px;
  border: 1px #dadada solid;
  padding-left: 20px;
  padding-right: 20px;
}

input:hover {
  border: 1px solid #2288ee;
}

input:focus {
  outline: 1px solid #2288ee;
}

.chead {
  text-align: center;
  padding-top: 110px;
  font-size: 70px;
  font-weight: 600;
  color: #414141;
}

.content {
  padding-left: 65px;
}

.box {
  width: 500px;
  height: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
  /* background: url("http://k21vin.gitee.io/front-end-data-visualization/assets/bg01.13dfb262.jpg"); */
  background-size: 100%;
  background-position: center;
}

.frosted__glass {
  width: 100%;
  height: 40%;
  border-radius: 40px;
  /* display: flex; */
  /* justify-content: center;
    align-items: center; */
  text-align: center;
  font-size: 40px;
  letter-spacing: 0.5em;
  backdrop-filter: blur(5px);
  color: #929292;
  line-height: 80px;
  padding-top: 5%;
  padding-bottom: 8%;
  font-weight: 600;
  /* box-shadow: 0 0 30px 10px rgba(0, 0, 0, 0.3); */
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
}

.box2 {
  width: 100%;
  height: 900px;
  display: flex;
  justify-content: center;
  align-items: center;
  /* background: url("http://k21vin.gitee.io/front-end-data-visualization/assets/bg01.13dfb262.jpg"); */
  background-size: 100%;
  background-position: center;
}

.frosted__glass2 {
  width: 80%;
  height: 90%;
  border-radius: 40px;
  /* display: flex; */
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: 40px;
  letter-spacing: 0.5em;
  backdrop-filter: blur(5px);
  color: #929292;
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
}
</style>
<style scoped>
canvas {
  display: block;
}

.waves {
  position: absolute;
  left: 2px;
  top: 0;
  right: 0;
  bottom: 0;
}
</style>
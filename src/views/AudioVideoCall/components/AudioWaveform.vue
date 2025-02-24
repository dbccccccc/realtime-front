<template>
  <canvas id="audioCanvas" />
</template>

<script>
import { getUserMedia } from "@/utils/stream";

export default {
  name: "AudioWaveform",
  props: {
    // 定时器跳动频率 单位ms
    beatRate: {
      type: Number,
      default: 0,
    },
    isConnected: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      audioContext: null, // 音频上下文
      mediaStreamSource: null, // 音频源
      scriptProcessorNode: null, // 音频处理节点
      audioInterval: null, // 截取音频片段的定时器
      // 绘制音频数据
      audioCanvas: null,
      ctx: null,
      audioPcmData: {
        data: [], // 音频数据
        size: 0, // 数据大小
        sampleRate: 0, // 采样率
        channelCount: 0, // 声道数
      },
    };
  },
  watch: {
    isConnected(val) {
      if (!val) {
        // 关闭麦克风
        this.closeAudio();
      } else {
        // 打开麦克风
        this.openAudio();
      }
    },
    beatRate: {
      handler(val) {
        if (val) {
          // 如果设置了定时器跳动频率，则开启定时器，按照频率截取音频数据
          this.audioInterval = setInterval(() => {
            // 将音频数据发送给父组件
            this.$emit("onAudioPcmData", this.audioPcmData);
          }, val);
        } else {
          this.audioInterval && clearInterval(this.audioInterval);
        }
      },
      immediate: true,
    },
    audioPcmData: {
      handler(val) {
        // 绘制音频波形
        this.drawRecord(val);
      },
      deep: true,
    },
  },
  mounted() {
    // 初始化音频画布
    this.audioCanvas = document.getElementById("audioCanvas");
    this.ctx = this.audioCanvas.getContext("2d");
  },
  methods: {
    // 重置音频数据
    resetAudioData() {
      this.audioPcmData = {
        data: [],
        size: 0,
      };
    },
    // 打开麦克风
    openAudio() {
      getUserMedia({
        audio: true, // 设置为 true 以请求音频流
      })
        .then((stream) => {
          if (stream.getAudioTracks().length > 0) {
            // 创建只包含音频轨道的 MediaStream
            const mediaStream = new MediaStream();
            stream.getAudioTracks().forEach((track) => mediaStream.addTrack(track));
            // 获取音频数据
            this.getAudioPcmData(mediaStream);
          }
        })
        .catch((error) => {
          // 处理获取麦克风权限失败的情况
          console.error("无法打开麦克风:", error);
          this.$message.error("无法打开麦克风，请开启麦克风权限！");
        });
    },
    // 当你完成音频处理并需要释放资源时，关闭麦克风
    closeAudio() {
      if (this.mediaStreamSource && this.scriptProcessorNode && this.audioContext) {
        // 断开节点连接
        this.mediaStreamSource.disconnect(this.scriptProcessorNode);
        this.scriptProcessorNode.disconnect(this.audioContext.destination);

        // 停止ScriptProcessorNode处理音频数据
        this.scriptProcessorNode.onaudioprocess = null;

        // 释放MediaStream
        const tracks = this.mediaStreamSource.mediaStream.getTracks();
        tracks.forEach((track) => track.stop());

        // 关闭AudioContext
        this.audioContext
          .close()
          .then(() => {
            console.log("AudioContext closed successfully");
          })
          .catch((err) => {
            console.error("Error closing AudioContext:", err);
          });
        this.audioContext = null;
        this.mediaStreamSource = null;
        this.scriptProcessorNode = null;
        this.resetAudioData();
      }
    },
    // 获取音频PCM数据
    getAudioPcmData(stream) {
      // 获得pcm格式的音频数据
      // 创建 AudioContext
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      // 创建 MediaStreamSource
      this.mediaStreamSource = this.audioContext.createMediaStreamSource(stream);
      // 创建录音节点，指定缓冲区大小和处理音频的输入输出通道数
      this.scriptProcessorNode = this.audioContext.createScriptProcessor(4096, 1, 1);
      this.audioPcmData.sampleRate = this.audioContext.sampleRate;
      this.audioPcmData.channelCount = this.mediaStreamSource.channelCount;
      // 当音频数据可用时执行的回调函数
      this.scriptProcessorNode.onaudioprocess = (audioProcessingEvent) => {
        const inputBuffer = audioProcessingEvent.inputBuffer;
        // 获取第一个（也是唯一一个）输入通道的 Float32Array 数据 leftChannelData 就是 PCM 数据
        const leftChannelData = inputBuffer.getChannelData(0);
        this.audioPcmData.data.push(new Float32Array(leftChannelData));
        this.audioPcmData.size += leftChannelData.length;
        // 如果没设置定时器，则随着事件监听直接将音频数据发送给父组件
        if (!this.beatRate) {
          this.$emit("onAudioPcmData", this.audioPcmData);
        }
      };
      // 将音频输入源连接到录音节点，并将录音节点连接到音频上下文的输出
      this.mediaStreamSource.connect(this.scriptProcessorNode);
      this.scriptProcessorNode.connect(this.audioContext.destination);
    },
    /**
     * 绘制音频波形
     */
    drawRecord(audioPcmData) {
      // 实时获取音频大小数据
      const dataArray = audioPcmData.data[audioPcmData.data.length - 1]?.slice(0, 1024);
      const bufferLength = dataArray?.length;
      // 填充背景色
      this.ctx.fillStyle = "#F7F8FA";
      this.ctx.fillRect(0, 0, this.audioCanvas.width, this.audioCanvas.height);
      // 设定波形绘制颜色
      this.ctx.lineWidth = 2;
      this.ctx.strokeStyle = "#134CFF";
      this.ctx.beginPath();
      const sliceWidth = (this.audioCanvas.width * 1.0) / bufferLength; // 一个点占多少位置，共有bufferLength个点要绘制
      let x = 0; // 绘制点的x轴位置
      for (let i = 0; i < bufferLength; i++) {
        // let v = dataArray[i] / 128.0
        // let y = (v * this.audioCanvas.height) / 2
        const s = Math.max(-1, Math.min(1, dataArray[i]));
        // 8位采样位划分成2^8=256份，它的范围是0-255;
        // 因为我们收集的数据范围在[-1,1]，那么你想转换成8位的话，
        // 只需要对负数*128，对正数*127，然后整体向上平移128(+128)，即可得到[0,255]范围的数据。
        let v = s < 0 ? s * 128 : s * 127;
        v = parseInt(v + 128);
        const y = ((v / 128.0) * this.audioCanvas.height) / 2;
        if (i === 0) {
          // 第一个点
          this.ctx.moveTo(x, y);
        } else {
          // 剩余的点
          this.ctx.lineTo(x, y);
        }
        // 依次平移，绘制所有点
        x += sliceWidth;
      }
      this.ctx.lineTo(this.audioCanvas.width, this.audioCanvas.height / 2);
      this.ctx.stroke();
    },
  },
  beforeDestroy() {
    this.closeAudio();
  },
};
</script>

<style lang="less" scoped>
#audioCanvas {
  width: 100%;
  height: 150px;
  border-radius: 8px;
  margin-top: 12px;
  margin-bottom: 24px;
  background-color: #f7f8fa;
}
</style>

/* Project https://github.com/AlexxIT/go2rtc */
import { VideoRTC } from "./video-rtc.js";

export class VideoStream extends VideoRTC {
    set divStatus(value) {
        this.querySelector(".status").innerText = value;
    }

    set divError(value) {
        const state = this.querySelector(".status").innerText;
        if (state !== "loading") return;
        this.querySelector(".status").innerText = "Error: " + value;
    }

    /**
     * Custom GUI
     */
    oninit() {
        console.debug("stream.oninit");
        super.oninit();

        this.innerHTML = `
        <style>
        .info {
            position: absolute;
            top: 0;
            right: 0;
            padding: 12px;
            color: white;
            display: flex;
            pointer-events: none;
        }
        </style>
        <div class="info">
            <div class="status"></div>
        </div>
        `;

        const info = this.querySelector(".info")
        this.insertBefore(this.video, info);
    }

    onconnect() {
        console.debug("stream.onconnect");
        const result = super.onconnect();
        if (result) this.divStatus = "loading";
        return result;
    }

    ondisconnect() {
        console.debug("stream.ondisconnect");
        super.ondisconnect();
    }

    onopen() {
        console.debug("stream.onopen");
        const result = super.onopen();

        this.onmessage["stream"] = msg => {
            console.debug("stream.onmessge", msg);
            switch (msg.type) {
                case "error":
                    this.divError = msg.value;
                    break;
                case "mse":
                    // Preserve loading state
                    break;
                case "mp4":
                    // Preserve loading state
                    break;
                case "mjpeg":
                    // Preserve loading state
                    // this.divStatus = msg.type.toUpperCase();
                    break;
            }
        }

        return result;
    }

    onclose() {
        console.debug("stream.onclose");
        return super.onclose();
    }

    onpcvideo(ev) {
        console.debug("stream.onpcvideo");
        super.onpcvideo(ev);

        if (this.pcState !== WebSocket.CLOSED) {
            this.divStatus = "RTC";
        }
    }
}


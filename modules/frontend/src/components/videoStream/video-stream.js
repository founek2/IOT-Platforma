/* Project https://github.com/AlexxIT/go2rtc */
import { VideoRTC } from './video-rtc.js';

/**
 * This is example, how you can extend VideoRTC player for your app.
 * Also you can check this example: https://github.com/AlexxIT/WebRTC
 */
export class VideoStream extends VideoRTC {
    internalMic = false;

    set divMode(value) {
        this.querySelector('.mode').innerText = value;
        this.querySelector('.status').innerText = '';
    }

    set mic(value) {
        this.internalMic = value;
        const button = this.querySelector('.mic button');
        if (!button) return;

        if (value) {
            button.innerText = 'Mluvte';
            this.unmuteMicrophone()
        }
        else {
            button.innerText = 'Ztlumeno';
            this.muteMicrophone()
        }
    }

    set divError(value) {
        const state = this.querySelector('.mode').innerText;
        if (state !== 'loading') return;
        this.querySelector('.mode').innerText = 'error';
        this.querySelector('.status').innerText = value;
    }

    /**
     * Custom GUI
     */
    oninit() {
        console.debug('stream.oninit');
        super.oninit();

        this.innerHTML = `
        <style>
        .info {
            position: absolute;
            top: 0;
            left: 0;
            padding: 12px;
            color: white;
            display: flex;
            pointer-events: none;
        }
        .mic {
            position: absolute;
            top: 0;
            right: 0;
            padding: 12px;
            color: white;
            display: flex;
        }
        </style>
        <div class="info">
            <div class="mode"></div>
            <div class="status"></div>
        </div>
        ${this.isMicrophoneEnabled() ? '<div class="mic"><button>mluvit</button></div>' : ''}
        `;

        const info = this.querySelector('.info');
        this.insertBefore(this.video, info);

        if (this.isMicrophoneEnabled())
            this.querySelector('.mic button').addEventListener('click', e => {
                console.log("hey hou")
                this.mic = !this.internalMic;
            })
    }

    onconnect() {
        console.debug('stream.onconnect');
        const result = super.onconnect();
        if (result) this.divMode = 'loading';
        this.mic = false;
        return result;
    }

    ondisconnect() {
        console.debug('stream.ondisconnect');
        super.ondisconnect();
    }

    onopen() {
        console.debug('stream.onopen');
        const result = super.onopen();

        this.onmessage['stream'] = msg => {
            console.debug('stream.onmessge', msg);
            switch (msg.type) {
                case 'error':
                    this.divError = msg.value;
                    break;
                case 'mse':
                case 'hls':
                case 'mp4':
                case 'mjpeg':
                    this.divMode = msg.type.toUpperCase();
                    break;
            }
        };

        return result;
    }

    onclose() {
        console.debug('stream.onclose');
        return super.onclose();
    }

    onpcvideo(ev) {
        console.debug('stream.onpcvideo');
        super.onpcvideo(ev);

        if (this.pcState !== WebSocket.CLOSED) {
            this.divMode = 'RTC';
        }
    }
}

// customElements.define('video-stream', VideoStream);
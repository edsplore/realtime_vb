async function initConversation() {
  const startBtn = document.getElementById('start');
  const stopBtn = document.getElementById('stop');
  const logEl = document.getElementById('log');

  startBtn.disabled = true;
  stopBtn.disabled = false;

  try {
    const tokenRes = await fetch('/session');
    const data = await tokenRes.json();
    if (!data.client_secret || !data.client_secret.value) {
      throw new Error(data.error || 'Failed to obtain session token');
    }
    const EPHEMERAL_KEY = data.client_secret.value;

    const pc = new RTCPeerConnection();
    const audioEl = new Audio();
    audioEl.autoplay = true;
    pc.ontrack = (e) => (audioEl.srcObject = e.streams[0]);

    const ms = await navigator.mediaDevices.getUserMedia({ audio: true });
    const track = ms.getTracks()[0];
    pc.addTrack(track);

    const dc = pc.createDataChannel('oai-events');
    dc.addEventListener('message', (e) => {
      const p = document.createElement('div');
      p.textContent = e.data;
      logEl.appendChild(p);
    });

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    const model = 'gpt-4o-realtime-preview-2025-06-03';
    const sdpResponse = await fetch(`https://api.openai.com/v1/realtime?model=${model}`, {
      method: 'POST',
      body: offer.sdp,
      headers: {
        Authorization: `Bearer ${EPHEMERAL_KEY}`,
        'Content-Type': 'application/sdp',
      },
    });

    const answer = { type: 'answer', sdp: await sdpResponse.text() };
    await pc.setRemoteDescription(answer);

    stopBtn.onclick = () => {
      pc.close();
      track.stop();
      startBtn.disabled = false;
      stopBtn.disabled = true;
    };
  } catch (err) {
    logEl.textContent = err.message;
    startBtn.disabled = false;
    stopBtn.disabled = true;
  }
}

document.getElementById('start').addEventListener('click', initConversation);

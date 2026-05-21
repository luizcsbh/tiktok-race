const { WebcastPushConnection } = require('tiktok-live-connector');
const { Server } = require('socket.io');
const http = require('http');

const srv = http.createServer();
const io  = new Server(srv, { cors:{ origin:'*' } });

srv.listen(3001, ()=>console.log('Relay rodando em :3001'));

io.on('connection', socket => {
  let tik = null;
  socket.on('connect-tiktok', async user => {
    try {
      tik = new WebcastPushConnection(user, {
        processInitialData: false, 
        enableExtendedGiftInfo: true 
      });
      await tik.connect();
      socket.emit('connected');
      tik.on('gift', d => {
        if (d.repeatEnd || d.giftType === 1) {
          socket.emit('gift', {
            giftId:      d.giftId,
            uniqueId:    d.uniqueId,
            repeatCount: d.repeatCount || 1 
          });
        }
      });
      tik.on('like', d => {
        socket.emit('like', {
          count: d.likeCount || 1
        });
      });
      tik.on('disconnected', ()=> socket.emit('disconnect'));
    } catch(e) { 
      socket.emit('error', e.message); 
    }
  });
  socket.on('disconnect', ()=>{ if(tik) tik.disconnect(); });
});

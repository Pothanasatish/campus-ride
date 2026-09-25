import localtunnel from 'localtunnel';

const startTunnel = async () => {
  try {
    const tunnel = await localtunnel({ port: 5173, subdomain: 'campusride-college' });
    console.log(`=================================================`);
    console.log(`  CampusRide Persistent Public Live HTTPS Link   `);
    console.log(`  Live URL: ${tunnel.url}                         `);
    console.log(`=================================================`);

    tunnel.on('close', () => {
      console.log('Tunnel closed. Reconnecting automatically in 2s...');
      setTimeout(startTunnel, 2000);
    });
    tunnel.on('error', (err) => {
      console.error('Tunnel error:', err.message);
      setTimeout(startTunnel, 2000);
    });
  } catch (err) {
    console.error('Failed to establish tunnel:', err.message);
    setTimeout(startTunnel, 3000);
  }
};

startTunnel();

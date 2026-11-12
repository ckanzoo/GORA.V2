<template>
  <ion-app>
    <!-- No Internet Screen Overlay -->
    <div v-if="!isOnline" class="offline-screen">
      <h2 class="logo-text">GORA<span>.</span></h2>
      <div class="icon-container">🏀</div>
      <h3>No Internet Connection</h3>
      <p>Please check your Wi-Fi or mobile data connection to continue using GORA.</p>
      <ion-button expand="block" class="gora-btn" @click="checkConnection">Try Again</ion-button>
    </div>

    <!-- Normal App Router -->
    <ion-router-outlet v-else />
  </ion-app>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { IonApp, IonRouterOutlet, IonButton } from '@ionic/vue';
import { Network } from '@capacitor/network';
import { installFilipinoLocalization } from '@/i18n';
import { installKeyboardViewport } from '@/utils/keyboard-viewport';

const isOnline = ref(true);

const checkConnection = async () => {
  const status = await Network.getStatus();
  isOnline.value = status.connected;
};

let stopKeyboardViewport: (() => void) | undefined;
let stopLocalization: (() => void) | undefined;

onMounted(async () => {
  stopKeyboardViewport = installKeyboardViewport();
  stopLocalization = installFilipinoLocalization(document.body);
  
  await checkConnection();
  Network.addListener('networkStatusChange', status => {
    isOnline.value = status.connected;
  });
});

onBeforeUnmount(() => {
  stopKeyboardViewport?.();
  stopLocalization?.();
});
</script>

<style scoped>
.offline-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #0b0b0b;
  color: white;
  padding: 28px;
  text-align: center;
}
.logo-text { 
  font-size: 32px; 
  font-weight: 900; 
  letter-spacing: 1px;
  color: white;
  margin-bottom: 25px; 
}
.logo-text span {
  color: #ff5722;
}
.icon-container { 
  font-size: 55px; 
  margin-bottom: 20px; 
}
.offline-screen h3 { 
  font-size: 22px; 
  font-weight: bold; 
  margin-bottom: 10px; 
  color: #ffffff;
}
.offline-screen p { 
  color: #a0a0a0; 
  font-size: 14px; 
  margin-bottom: 35px; 
  line-height: 1.5; 
  max-width: 320px;
}
.gora-btn {
  --background: #ff5722;
  --background-hover: #e64a19;
  --color: #ffffff;
  --border-radius: 8px;
  font-weight: bold;
  height: 48px;
  width: 100%;
  max-width: 320px;
  text-transform: none;
  font-size: 16px;
}
</style>
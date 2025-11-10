<template>
    <div class="not-found">
        <h2>Rất tiếc! Trang bạn yêu cầu không tồn tại.</h2>
        <router-link to="/" class="back-btn">Về trang chủ</router-link>
    </div>
</template>

<style scoped>
.not-found {
    min-height: 100vh;
    background-image: url('/img/background.jpg');
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
    background-repeat: no-repeat;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 20px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    color: #4a2c0b;
    /* Nâu đậm ấm */
    text-align: center;
    position: relative;
}


.not-found::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.1);
    /* Mờ nhẹ */
    z-index: 1;
}

.not-found>* {
    position: relative;
    z-index: 2;
    
}

.not-found h2 {
    font-size: 36px;
   
    font-weight: 600;
    margin-bottom: 20px;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    animation: fadeInUp 1s ease-out;
  
    opacity: 0;
    transform: translateY(20px);
}

.not-found .back-btn {
    display: inline-block;
    padding: 14px 28px;
    font-size: 16px;
    font-weight: 600;
    color: white;
    background: linear-gradient(135deg, #a0522d 0%, #cd853f 100%);
    /* Gradient nâu ấm */
    border: none;
    border-radius: 8px;
    text-decoration: none;
    cursor: pointer;
    transition: all 0.3s ease;
    will-change: transform;
    box-shadow: 0 4px 12px rgba(160, 82, 45, 0.2);
}

.not-found .back-btn:hover {
    transform: translateY(-2px) scale(1.05);
    box-shadow: 0 6px 16px rgba(160, 82, 45, 0.3);
    animation: pulse 1.5s infinite;
    /* Pulse nhẹ như button trước */
}

.not-found .back-btn:active {
    transform: translateY(0) scale(0.98);
}

/* Keyframes hiệu ứng */
@keyframes fadeInUp {
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes pulse {
    0% {
        box-shadow: 0 4px 12px rgba(160, 82, 45, 0.2);
    }

    50% {
        box-shadow: 0 6px 16px rgba(160, 82, 45, 0.3);
    }

    100% {
        box-shadow: 0 4px 12px rgba(160, 82, 45, 0.2);
    }
}

/* Responsive */
@media (max-width: 480px) {
    .not-found {
        background-attachment: scroll;
        padding: 10px;
    }

    .not-found h2 {
        font-size: 28px;
    }

    .not-found .back-btn {
        padding: 12px 24px;
        font-size: 15px;
    }
}
</style>
const searchButton = document.getElementById("search");
const resultsList = document.getElementById("results");

searchButton.addEventListener("click", async () => {
  const niche = document.getElementById("niche").value;
  try {
    const response = await fetch(`/search?niche=${niche}`);
    if (!response.ok) {
      throw new Error("Erro na rede");
    }
    const videos = await response.json();

    // Ordenar os vídeos por visualizações (descendente)
    videos.sort((a, b) => {
      const viewCountA = parseInt(a.viewCount);
      const viewCountB = parseInt(b.viewCount);
      return viewCountB - viewCountA;
    });

    // Selecionar os 15 primeiros vídeos
    const topVideos = videos.slice(0, 15);

    // Limpar a lista antes de adicionar novos itens
    resultsList.innerHTML = "";

    topVideos.forEach((video) => {
      const li = document.createElement("li");
      li.classList.add("video-item");

      const videoInfo = document.createElement("div");
      videoInfo.classList.add("video-info");

      // Adicionar a miniatura, se disponível
      const thumbnail = document.createElement('img');
      thumbnail.src = video.thumbnail || 'imagem_erro.png';
      thumbnail.alt = video.title || 'Miniatura não disponível';
      videoInfo.appendChild(thumbnail);

      // Adicionar informações do vídeo ao elemento div
      li.innerHTML = `
        <h3>${video.title || "Título Indisponível"}</h3>
        <p>${video.description || "Descrição Indisponível"}</p>
        <p>Visualizações: ${video.viewCount || "Indisponível"}</p>
        <p>Canal: ${video.channelTitle || "Indisponível"}</p>
        <p>Likes: ${video.likeCount || "Indisponível"}</p>
      `;

      // Adicionar o link para assistir ao vídeo
      const watchLink = document.createElement('a');
      watchLink.href = video.url;
      watchLink.textContent = 'Assistir';
      videoInfo.appendChild(watchLink);

      li.appendChild(videoInfo);
      resultsList.appendChild(li);
    });
  } catch (error) {
    console.error("Erro ao buscar vídeos:", error);
    resultsList.innerHTML =
      "<p>Ocorreu um erro ao buscar os vídeos. Tente novamente mais tarde.</p>";
  }
});
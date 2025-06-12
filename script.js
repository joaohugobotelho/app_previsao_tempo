// Substitua pela sua chave da API do OpenWeatherMap
const apiKey = "43240b1aab369620e5a467547f42d6ce"; // ← coloque sua chave aqui

// Pegando os elementos da página
const searchBtn = document.getElementById("searchBtn"); // Botão "Buscar"
const cityInput = document.getElementById("cityInput"); // Campo de texto da cidade

// Criando dinamicamente um container para a previsão estendida (5 dias)
const forecastContainer = document.createElement("div");
forecastContainer.id = "forecast";
document.body.appendChild(forecastContainer); // Adiciona no final da página

// Função principal que busca o clima atual e a previsão de 5 dias
async function buscarClima() {
  const city = cityInput.value; // Pega o texto digitado no input

  // Validação: se estiver vazio, alerta o usuário
  if (!city) return alert("Por favor, digite uma cidade.");

  // Endereço da API para o clima atual
  const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&lang=pt_br&units=metric`;

  // Endereço da API para a previsão de 5 dias (3h em 3h)
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&lang=pt_br&units=metric`;

  try {
    // Faz a requisição do clima atual
    const weatherResponse = await fetch(currentWeatherUrl);

    // Se não encontrar a cidade ou houver erro, lança uma exceção
    if (!weatherResponse.ok) throw new Error("Cidade não encontrada.");

    // Converte a resposta em JSON
    const weatherData = await weatherResponse.json();

    // Atualiza a interface com os dados do clima atual
    document.getElementById("cityName").innerText = weatherData.name;
    document.getElementById("temperature").innerText = Math.round(
      weatherData.main.temp
    );
    document.getElementById("condition").innerText =
      weatherData.weather[0].description;

    // Mostra a div de resultado (caso esteja escondida)
    document.getElementById("weatherResult").classList.remove("hidden");

    // Faz a requisição da previsão estendida
    const forecastResponse = await fetch(forecastUrl);
    const forecastData = await forecastResponse.json();

    // Filtra apenas os dados com horário "12:00:00" (um por dia)
    const dailyForecasts = forecastData.list.filter((f) =>
      f.dt_txt.includes("12:00:00")
    );

    // Limpa previsões anteriores (se houver)
    forecastContainer.innerHTML = "";

    // Cria e adiciona o título "Previsão para os próximos dias"
    const titulo = document.createElement("h3");
    titulo.textContent = "Previsão para os próximos dias:";
    titulo.style.width = "100%";
    titulo.style.marginBottom = "10px";
    forecastContainer.appendChild(titulo);

    // Para cada previsão diária, cria um card e insere no container
    dailyForecasts.forEach((day) => {
      // Converte a data/hora para formato legível
      const date = new Date(day.dt_txt).toLocaleDateString("pt-BR", {
        weekday: "long",
        day: "numeric",
        month: "short",
      });

      // Arredonda a temperatura e pega descrição e ícone
      const temp = Math.round(day.main.temp);
      const desc = day.weather[0].description;
      const icon = day.weather[0].icon;
      const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

      // Cria o card da previsão
      const card = document.createElement("div");
      card.className = "forecast-card";
      card.innerHTML = `
        <p><strong>${date}</strong></p>
        <img src="${iconUrl}" alt="${desc}" />
        <p>${temp}°C</p>
        <p>${desc}</p>
      `;

      // Adiciona o card ao container
      forecastContainer.appendChild(card);
    });
  } catch (error) {
    // Mostra mensagem de erro para o usuário
    alert("Erro: " + error.message);
  }
}

// Adiciona evento de clique ao botão "Buscar"
searchBtn.addEventListener("click", buscarClima);

// Adiciona suporte para pressionar Enter no campo de texto
cityInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    buscarClima();
  }
});
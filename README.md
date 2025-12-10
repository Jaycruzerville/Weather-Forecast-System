# Weather Dashboard

Hey! Welcome to my Weather Dashboard. I built this using **Nuxt 3** because I wanted to create something that didn't just work well, but also looked and felt great to use. It connects to the OpenWeatherMap API to give you accurate weather info for pretty much any city you can think of.

## What Can It Do?

I didn't want just a boring list of numbers, so here's what I packed into this app:

### The Essentials
*   **Right Now**: It tells you exactly what's happening outside—temperature, humidity, wind, pressure—all the important stuff.
*   **The Next 5 Days**: A clear look at the week ahead so you know if you need an umbrella or sunglasses.
*   **Hour-by-Hour**: A scrollable 48-hour view for when you need to know *exactly* when the rain will stop.
*   **Search Anywhere**: Just start typing a city name, and it'll find it.
*   **Your Location**: Click the little arrow, and it'll grab the weather for exactly where you're standing.
*   **Favorites**: You can "heart" cities to save them for later.
*   **C° / F°**: Toggle between Celsius and Fahrenheit because we all have our preferences.

### The Look & Feel
*   **Glassy Design**: I went for a "Glassmorphism" look—translucent cards with a blurred background. It feels modern and clean.
*   **Day & Night Modes**:
    *   **Light Mode**: A bright, energetic blue/purple gradient.
    *   **Dark Mode**: A deep, relaxing slate/indigo vibe that's easy on the eyes at night.
*   **Custom Icons**: I wasn't happy with the default weather icons, so I built my own!
    *   The **Sun** actually spins slowly.
    *   The **Rain** drops fall.
    *   The **Thunder** pulses.
    *   And the clouds? They're fluffy and smooth, not broken shapes.

## The Tricky Parts (And How I Solved Them)

Building this wasn't just smooth sailing. Here are a few headaches I ran into and how I fixed them:

### 1. The "Missing Today" Mystery
**The Problem**: Sometimes, especially late in the day, the 5-day forecast would just... skip today and start with tomorrow. It was super confusing to see "Tuesday" on the main card and "Wednesday" starting the list.
**The Fix**: I wrote a little logic check. If the app sees that "Today" is missing from the forecast list, it grabs the current weather data, dresses it up as a forecast item, and sneaks it to the front of the line. Now the list always starts with *Today*.

### 2. The Timezone Headscratcher
**The Problem**: Timezones are hard. If you looked up Tokyo weather while sitting in New York, "Tomorrow" in Tokyo might still be "Today" for you. This caused weird bugs where you'd see two "Wednesdays" in the list.
**The Fix**: I stopped relying on the browser's time and started using the **City's Local Time**. Now, "Wednesday" in the app means "Wednesday in Tokyo," not "Wednesday in New York." No more duplicate days!

### 3. Those Ugly Black Circles
**The Problem**: The default "Clear Night" icon from the API was just a black circle. On a dark background, it looked like a hole in the screen.
**The Fix**: I scrapped the images entirely and built a custom `WeatherIcon` component. Now, a clear night shows a crisp, glowing crescent moon. Much better.

### 4. The Clipped Ring
**The Problem**: I added a cool blue glow ring to highlight "Today," but the top of it kept getting cut off by the container.
**The Fix**: Simple but effective—I added just a tiny bit of padding to the top of the list. Now the glow has room to shine.

## How to Run It

Want to try it out? Here's how to get it running on your machine:

### 1. Get the Code
First, install the dependencies:

```bash
npm install
```

### 2. Get the Key
You'll need an API key from OpenWeatherMap (it's free!).
1. Go to [OpenWeatherMap](https://openweathermap.org/api) and sign up.
2. Create a file named `.env` in the root folder (you can copy `.env.example`).
3. Paste your key in there like this:
   ```
   OPENWEATHER_API_KEY=your_api_key_here
   ```

### 3. Blast Off
Start the server:

```bash
npm run dev
```

Open your browser to `http://localhost:3000` and you're good to go!

## How It's Organized

If you want to poke around the code, here's the map:

*   **`pages/`**: The main views. `index.vue` is where the magic happens.
*   **`components/`**: The building blocks.
    *   `weather/`: All the specific weather stuff (Current, Forecast, those custom Icons).
    *   `ui/`: Generic buttons and cards.
*   **`composables/`**: The brain. `useWeather.ts` handles all the data fetching and that tricky sync logic.
*   **`server/`**: The backend. This hides your API key and formats the data before sending it to the front.

## Checklist

Here's what I've finished so far:

- [x] Build the UI (and make it pretty)
- [x] Make it work on mobile
- [x] Add that Dark/Light mode toggle
- [x] Let users save Favorites
- [x] Get the Geolocation working
- [x] Add the Hourly Forecast chart

---

**Built with love (and a lot of coffee) using Nuxt 3**

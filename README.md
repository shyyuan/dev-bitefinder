# BiteFinder
<b>Live Site</b>: http://http://bitefinder.herokuapp.com/
<!-- ============= TECHNOLOGIES USED ============= -->
<h1>Technologies Used</h1>
<p>BiteFinder is a single-page application that utilizes MongoDB, Express, Angular, and Node. It is powered by a third-party API called <a href="https://developers.zomato.com/documentation">Zomato</a>, which provides a database of restaurants that are searchable by location. The server provides RESTful routes for creating, editing, and deleting user profiles. For logging in and saving passwords, we used the NPM packages <a href="https://www.npmjs.com/package/express-session">express-session</a> and <a href="https://www.npmjs.com/package/bcrypt">bcrypt</a>.</p>

<!-- ============= USER STORIES ============= -->
<h1>User Stories</h1>
<h3>As a user, I am able to...</h3>
<ol>
  <li>Find a list of restaurants in a given location range.</li>
  <li>Register for an account.</li>
  <li>Enter my username and password to log in.</li>
  <li>Edit my own profile details or delete my account.</li>
  <li>See detailed information about one restaurant when I click it.</li>
  <li>Save a restaurant to a list of my favorites or pins.</li>
  <li>“Unpin” and unsave a restaurant from my favorites list.</li>
  <li>Narrow down my restaurant search results based on a specific query (ideas: cuisine type, establishment type)</li>
</ol>
<h1>Stretch Goals</h1>
<h3>As a user, I am able to...</h3>
<ol>
  <li>Create a review or rating of the restaurant and post it to the restaurant's global display.</li>
  <li>Edit or delete my rating/review.</li>
</ol>

<!-- ============= WIRE FRAMES ============= -->
<h1>Wire Frames</h1>
<p>We began developing a design for this page in mobile view. The layout is completely vertical. We decided right away on having a dynamic navigation bar, with a total of five different nav buttons. Although five exist, only three are viewed at once. When a user signs into their session, two of the nav buttons toggle into view (Profile and Favorites), while another two toggle out of view (Login and Register).</p>
<img src="/public/img/readme/wireframe1.png">
<img src="/public/img/readme/wireframe2.png">

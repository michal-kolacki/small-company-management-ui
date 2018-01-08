<template>
    <div class="row">
        <nav class="navbar navbar-default">
            <ul class="nav navbar-nav">
                <li><router-link to="/">Home</router-link></li>
                <li><router-link to="/projects">Projects</router-link></li>
            </ul>
        </nav>
    </div>
</template>

<script>
export default {
  name: 'Navbar',
};
</script>
<script>
	/** @type {import('./$types').PageProps}*/
	let { data } = $props()
</script>
<svelte:head>
	<title>Home page</title>
</svelte:head>

<h1>
	{#if data.user}
		Welcome back, {data.user.username}!
	{:else}
		Hello stranger!
	{/if}
</h1>

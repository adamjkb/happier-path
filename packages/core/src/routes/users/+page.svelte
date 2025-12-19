<script>
	import { allUsers } from './users.remote.js'
</script>
<svelte:boundary>
	<ul data-testid='users'>
		Users
		{#each await allUsers() as {username}(username)}
			<li data-testid='user-{username}'>
				{username}
			</li>
		{/each}
	</ul>
</svelte:boundary>

<script>
	import { applyAction, enhance } from '$app/forms'
	import { goto } from '$app/navigation'

</script>
<form
	method='POST'
	use:enhance={() => {
		return async ({ result }) => {
			// `result` is an `ActionResult` object
			if (result.type === 'redirect') {
				goto(result.location)
			} else {
				await applyAction(result)
			}
		}
	}}>
	<label>
		Username
		<input
			name='username'
			type='username'>
	</label>
	<label>
		Password
		<input
			name='password'
			type='password'>
	</label>
	<button type='submit'>Log in</button>
</form>

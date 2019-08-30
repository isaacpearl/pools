print("\tuploading Globals.lua")

events = {}
pools = {}

functions = {
	toward = to,
	note = note 
}

behaviors = {
	step = function(index, pool)
		print("step pool.drops: ", pool.drops)
		return 1 + (index % #pool.drops)
	end, 	
	rand = function(index, pool)
		return math.ceil(math.random(#pool.drops))
	end
}

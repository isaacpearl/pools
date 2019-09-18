print("\tuploading Globals.lua")

bpm = 120

events = {}
pools = {}

functions = {
	toward = to,
	note = note 
}

behaviors = {
	step = function(index, pool)
		return 1 + (index % #pools[pool].drops)
	end, 	
	rand = function(index, pool)
		return math.ceil(math.random(#pools[pool].drops))
	end
}


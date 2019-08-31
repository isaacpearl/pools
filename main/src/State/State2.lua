print("\tuploading State2.lua")

function resetScript()
	hasPools = nil 
	print("ready for new lua scripts - restart pools to upload :)")
end

hasPools = function() 
	print("Pools state script status requested")
	_c.tell('pools') 
end

function pretty_print(t)
	print("{ ")
	for k, v in pairs(t) do
		if type(v) == "table" then
			pretty_print(v)
		else
			print(tostring(v)..", ")
		end
	end
	print("}")
end

function init()
	print("init()")
	for c=1, 4 do
        output[c]()
    end
end

function resetPools()
	_c.tell("reset_state")
	events = {}
	pools = {}
	for n=1,4 do 
		output[n](to(0)) 
	end
	init()
end

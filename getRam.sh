#!/bin/bash
free -wb | xargs | awk '{print"[{\"type\": \"ram\",\""$1"\": "$9",\""$2"\": "$10",\""$3"\": "$11",\""$4"\": "$12",\""$5"\": "$13",\""$6"\": "$14",\""$7"\": "$15"},{\"type\": \"swap\",\""$1"\": "$17",\""$2"\": "$18",\""$3"\": "$19"}]"}'
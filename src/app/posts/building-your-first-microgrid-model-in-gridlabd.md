---
title: "Building Your First Microgrid Model in GridLAB-D"
date: 2025-01-30
author: "Sayonsom Chanda, Ph.D."
categories: ["microgrids", "power systems", "simulation"]
tags: ["gridlabd", "distributed energy", "solar PV", "battery storage", "economic analysis", "tutorial", "microgrids"]
description: "A hands-on guide to modeling microgrids with solar, storage, and smart loads in GridLAB-D"
excerpt: "Learn how to build sophisticated microgrid models in GridLAB-D with solar panels, battery storage, and smart loads. This comprehensive tutorial covers everything from basic setup to economic analysis."
coverImage: "https://res.cloudinary.com/dti7egpsg/image/upload/v1756862505/SARAL%20Systems%20Blog/Gemini_Generated_Image_xve58xve58xve58x_mbirdp.png"
coverAlt: "Building Your First Microgrid Model in GridLAB-D cover image"
---

# Building Your First Microgrid Model in GridLAB-D

So you want to model a microgrid? Good timing. The market's exploding, and everyone's scrambling to understand how these systems actually work. GridLAB-D might not win any beauty contests, but it's free, powerful, and gets the job done.

## Why GridLAB-D for Microgrids?

Here's the thing - most commercial tools cost a fortune. GridLAB-D? It's open-source, handles time-series simulations beautifully, and plays nice with both technical and economic analysis. Plus, it's got built-in modules for everything we need: solar panels, batteries, smart inverters, you name it.

Want to simulate a full year of operations with 1-minute resolution? No problem. Need to model market interactions and demand response? It's got you covered.

## Setting Up Your Base Model

Let's start with something real. We'll build a small campus microgrid with a 500 kW solar array, a 250 kW/500 kWh battery system, and some controllable loads. Think university campus or small industrial facility.

```glm
// microgrid_base.glm
clock {
   timezone PST+8PDT;
   starttime '2024-01-01 00:00:00';
   stoptime '2024-01-07 00:00:00';
}

module powerflow {
   solver_method NR;
   NR_iteration_limit 50;
}
module climate;
module generators;
module market;
module tape;

// Weather data - critical for solar modeling
object climate {
   name "weather";
   tmyfile "CA-San_francisco.tmy3";
   interpolate QUADRATIC;
}
```

See what we did there? We're pulling actual weather data from a TMY3 file. That's your solar radiation, temperature, wind speed - everything that affects PV output.

## Adding the Distribution Network

Your microgrid needs bones - the actual electrical network. We'll keep it simple but realistic: a main feeder, a couple of laterals, and connection points for our DERs.

```
// Main grid connection point
object meter {
    name "main_meter";
    phases ABCN;
    nominal_voltage 7200;
    voltage_A 7200+0j;
    voltage_B -3600-6235j;
    voltage_C -3600+6235j;
}

// Distribution transformer
object transformer {
    name "main_transformer";
    phases ABCN;
    from "main_meter";
    to "microgrid_bus";
    configuration "transformer_config";
}

object transformer_configuration {
    name "transformer_config";
    connect_type WYE_WYE;
    power_rating 1000 kVA;
    primary_voltage 12470;
    secondary_voltage 480;
    impedance 0.01+0.06j;
}

// Main microgrid bus
object node {
    name "microgrid_bus";
    phases ABCN;
    nominal_voltage 277;
}
```

Why all the detail? Because voltage matters. Your battery inverter behaves differently at 0.95 pu than at 1.05 pu. Your solar inverter might curtail output if voltage gets too high. These aren't just numbers - they're what makes or breaks your microgrid operation.

## Solar PV Integration

Time for the fun part - adding solar. GridLAB-D's solar module is surprisingly sophisticated. It models temperature effects, shading, inverter efficiency curves, the works.

```
object solar {
    name "solar_array";
    parent "microgrid_bus";
    generator_status ONLINE;
    generator_mode SUPPLY_DRIVEN;
    panel_type SINGLE_CRYSTAL_SILICON;
    area 3000 m^2;  // roughly 500 kW at peak
    tilt_angle 30;
    efficiency 0.20;
    orientation_azimuth 180;  // facing south
    SOLAR_TILT_MODEL SOLPOS;
    SOLAR_POWER_MODEL FLATPLATE;
    
    // Inverter settings
    rated_power 500 kW;
    Rated_kVA 550;  // slight oversizing for reactive power
    power_factor 1.0;
    
    // Connect to weather
    climate "weather";
}

// Record solar output
object recorder {
    parent "solar_array";
    property "VA_Out.real,VA_Out.imag";
    interval 300;  // 5-minute intervals
    file "solar_output.csv";
}
```

Notice the SUPPLY_DRIVEN mode? That means the solar produces whatever it can based on irradiance. You could switch to CONSTANT_PF if you want to control reactive power, or use FOUR_QUADRANT for full grid support capabilities.

Battery Energy Storage System (BESS)


What's a microgrid without storage? Pretty useless, honestly. The battery smooths out solar variability, provides backup power, and enables energy arbitrage if you're playing the market game.

```object battery {
    name "battery_system";
    parent "microgrid_bus";
    generator_status ONLINE;
    battery_type LI_ION;
    
    // Size specifications
    rated_power 250 kW;
    energy_capacity 500 kWh;
    base_efficiency 0.95;
    
    // Operating parameters
    round_trip_efficiency 0.90;
    state_of_charge 0.5;  // start at 50%
    min_soc 0.1;
    max_soc 0.9;
    
    // Control strategy
    generator_mode SCHEDULE;
    schedule_skew 0;
    
    // Charge/discharge schedule (simplified)
    object schedule {
        name "battery_schedule";
        // Charge during solar peak (10am-2pm)
        10-14 * * * * -200000+0j;  // charging at 200kW
        // Discharge during evening peak (6pm-9pm)
        18-21 * * * * 200000+0j;   // discharging at 200kW
        // Float otherwise
        * * * * * 0+0j;
    }
}
```

Real-world tip? That schedule is way too simple. You'd actually want to implement a controller that responds to solar output, load demand, and maybe time-of-use rates. But hey, we're starting somewhere.

### Load Management and Demand Response

Here's where it gets interesting. Smart loads can make or break your microgrid economics. Let's model some controllable loads - think HVAC systems, EV chargers, or industrial processes.

```
// Critical load - always on
object load {
    name "critical_load";
    parent "microgrid_bus";
    phases ABCN;
    constant_power_A 50000+10000j;
    constant_power_B 50000+10000j;
    constant_power_C 50000+10000j;
    nominal_voltage 277;
}

// Controllable load with ZIP model
object load {
    name "flexible_load";
    parent "microgrid_bus";
    phases ABCN;
    
    // ZIP coefficients (constant impedance, current, power)
    base_power_A 30000;
    base_power_B 30000;
    base_power_C 30000;
    
    power_fraction_A 0.3;
    current_fraction_A 0.3;
    impedance_fraction_A 0.4;
    
    power_fraction_B 0.3;
    current_fraction_B 0.3;
    impedance_fraction_B 0.4;
    
    power_fraction_C 0.3;
    current_fraction_C 0.3;
    impedance_fraction_C 0.4;
}

// Demand response controller
object controller {
    name "dr_controller";
    parent "flexible_load";
    control_mode RAMP;
    
    // Reduce load when battery SOC < 20%
    objective "battery_system.state_of_charge";
    target 0.2;
    setpoint "base_power_A";
    
    ramp_low 15000;  // minimum load
    ramp_high 30000;  // maximum load
}
```

What's happening here? The controller watches battery SOC and throttles the flexible load accordingly. Low battery? Cut the load. Plenty of juice? Let it run full blast.

## vEconomic Analysis Module

Numbers matter. Is your microgrid saving money or burning it? GridLAB-D can track costs in real-time, which is pretty slick for feasibility studies.

```
// Market pricing
object market {
    name "energy_market";
    period 3600;  // hourly pricing
    
    // Time-of-use rates (simplified)
    object schedule {
        name "tou_price";
        // Off-peak: $0.08/kWh
        0-6,22-23 * * * * 0.08;
        // Mid-peak: $0.12/kWh
        7-11,14-17 * * * * 0.12;
        // On-peak: $0.20/kWh
        12-13,18-21 * * * * 0.20;
    }
}

// Bill calculator
object bill {
    name "monthly_bill";
    parent "main_meter";
    price "energy_market.current_price";
    
    monthly_energy_charge TRUE;
    monthly_demand_charge TRUE;
    demand_charge_base 15.00;  // $/kW
    
    object recorder {
        property "total,energy_charge,demand_charge";
        interval 3600;
        file "billing_data.csv";
    }
}

// Calculate savings
object collector {
    name "economic_metrics";
    group "class=bill";
    property "sum(total)";
    interval 86400;  // daily totals
    file "daily_costs.csv";
}
```

Run this for a year, and you've got your ROI calculation. Compare against a no-microgrid baseline, factor in capital costs, and boom - there's your business case.

## Running Your Simulation

Ready to roll? Save everything to a file and fire it up:

```
# Basic run
gridlabd microgrid_model.glm

# Verbose output for debugging
gridlabd -v --debug microgrid_model.glm

# Parallel processing for long runs
gridlabd --threadcount 4 microgrid_model.glm
```

Getting errors? Join the club. 

Check your phase connections first - that's where 90% of problems hide. Make sure every object has a parent, and watch those nominal voltages.

## Analyzing Results

The simulation spits out CSV files. Time to make sense of them. Here's a quick Python snippet to get you started:

```python
import pandas as pd
import matplotlib.pyplot as plt

# Load solar output
solar = pd.read_csv('solar_output.csv', 
                    parse_dates=['# timestamp'])
solar.set_index('# timestamp', inplace=True)

# Calculate real power (kW)
solar['power_kw'] = solar['VA_Out.real'] / 1000

# Daily generation profile
daily_profile = solar.groupby(solar.index.hour)['power_kw'].mean()

plt.figure(figsize=(10, 6))
plt.plot(daily_profile.index, daily_profile.values)
plt.xlabel('Hour of Day')
plt.ylabel('Average Power (kW)')
plt.title('Solar Generation Profile')
plt.grid(True)
plt.show()

# Economic analysis
bills = pd.read_csv('billing_data.csv',
                   parse_dates=['# timestamp'])
                   
monthly_savings = bills['total'].resample('M').sum()
print(f"Monthly average savings: ${monthly_savings.mean():.2f}")
```

## Advanced Topics to Explore
Got the basics down? Here's where to go next:
1. Islanding Operations: Add a diesel generator and island detection logic. Model the transition from grid-connected to island mode - it's trickier than you'd think.
2. Stochastic Analysis: Run Monte Carlo simulations with varying load profiles and weather patterns. GridLAB-D supports random variables for uncertainty analysis.
3. Real-time Control: Implement model predictive control using GridLAB-D's connection to MATLAB or Python. Optimize battery dispatch based on solar forecasts and load predictions.
4. Protection Coordination: Model overcurrent relays, reclosers, and fuses. Make sure your microgrid doesn't cause protection headaches for the utility.

## Common Pitfalls and How to Avoid Them
- Convergence Issues: Power flow not converging? Reduce your timestep, check for isolated nodes, or switch to FBS solver for radial networks.
- Unrealistic Battery Behavior: Real batteries have voltage-dependent capacity, temperature effects, and degradation. The simple model we used? It's a starting point, not gospel.
- Missing Reactive Power: Don't ignore VARs. Your inverters need to provide voltage support, especially in island mode. Set those power factors appropriately.
- Economic Oversimplification: We used flat demand charges and simple TOU rates. Real tariffs are way more complex - tiered rates, coincident peak charges, standby charges. Do your homework.

## Where to Go From Here

You've built your first microgrid model. Not bad, right? The real power comes from iterating - tweak the controls, optimize the sizing, add more complexity.
Want to get serious? Connect GridLAB-D to optimization tools like GAMS or Pyomo. Run co-simulations with communication networks using ns-3. Model transient behavior with PSCAD interface.
The microgrid market's growing 20% annually. Utilities need these models. Developers need them. Researchers definitely need them. You've just joined a pretty exclusive club of people who can actually build them.
Questions? The GridLAB-D forums are surprisingly active. The documentation's decent once you know where to look. And remember - every expert started with a simple model that barely worked.
Now go build something cool.
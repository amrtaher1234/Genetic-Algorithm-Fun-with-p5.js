
var population; 
var lifespan = 200; 
var count = 0; 
var target; 
function setup()
{
createCanvas(windowWidth, windowHeight);
target = createVector(width/2 , 50); 
population= new Population();  
}


function draw()
{
background(0 , 25); 
fill(12 ,120,40); 
ellipse(target.x , target.y , 50); 
if (count>=lifespan)
{
    count=0; 
    var temp  = population.crossOver(); 

    population= new Population(temp); 
}
else{
population.run(); 
count++;
} 
}

class DNA
{
    constructor(gene)
    {
        this.size = 200 ; 
        if (gene)
        {
            this.genes= gene; 
        }
        else
        {
            this.genes = []; 
            for(var i =0; i<this.size ; i++)
        {
            var p = p5.Vector.random2D(); 
            p.mult(0.2);
            this.genes.push(p); 
        }
        }
    }
}

class Population
{
    constructor(new_generation)
    {
        this.size = 50; 
        this.rockets = [] ;
        this.mating_pool = []; 
        this.mutation = 0.001; 
        this.average_fitness=0; 
        if (new_generation)
        {
            this.rockets= new_generation; 
        }
        else
        {
        for (var i =0; i<this.size; i++)
        {
            this.rockets.push(new Rocket()); 
        }
    } 
    }
    run()
    {
        for (var i =0; i<this.rockets.length; i++)
        {
            this.rockets[i].draw(); 
            this.rockets[i].updaterocket();  
            this.rockets[i].calcFitness(); 
        }
    }

    crossOver()
    {
        // /mating_val = 0.4; 
       // var mating_val ;
        for (var i = 0; i<this.rockets.length; i++)
        {
           var mating_val = this.rockets[i].fitness*100; 

            for (var j = 0; j<mating_val; j++)
            {
                // creating a list of indexes of each pool and multiplying their fitness to add them to a list as something like
                // randomising with the greater fitness chromosomes, thus when choosing new rockets the ones with 
                // higher fitnesses shall be picked in a higher probability.
                this.mating_pool.push(i); 
               // mating_val = 0 ;
            }
        }
        //console.log(this.mating_pool); 
        
        //console.log(ran1); 
        var new_rockets = [];
        for(var k =0; k<this.size; k++)
        {
        var ran1 = random(this.mating_pool); 
        var ran2 = random(this.mating_pool); 
        var parent_one = this.rockets[ran1]; 
        var parent_two = this.rockets[ran2]; 
        var gene_passing=[]; 

        //console.log(parent_one.dna.genes.length); 
        // now we have two random rockets supposedly they'll have a high fitness as the pooling list contains mostly high fitness rockets.
        for (var n = 0; n<parent_one.dna.genes.length; n++)
        {
            if (n<parent_one.dna.length/2)
                gene_passing.push(parent_one.dna.genes[n]); 
            
            else
                gene_passing.push(parent_two.dna.genes[n]);  

            if (random(0,1) <=this.mutation)  {
            // this handles the mutation, if a random value generated is less than our mutation(1%),
            // it will be changed  randomly
             gene_passing[n]=p5.Vector.random2D(); 
            }
        }

        var dna_temp = new DNA(gene_passing); 
        var rocket_temp = new Rocket(dna_temp); 
        new_rockets.push(rocket_temp); 
        }
        
        return new_rockets;
    }
}

class Rocket 
{
    constructor(dna_passed)
    {
        this.pos = createVector(width/2 , height); 
        this.acc = createVector(0,0); 
        this.vel = createVector(); 
        
        if (dna_passed)
        {
        this.dna = dna_passed; 
        }
        else{
         //this.vel = p5.Vector.random2D(); 
        this.dna = new DNA(); 
        }
        this.fitness;
    }
    applyForce(force) {
        this.acc.add(force);
      }
    draw()
    {
        push();
        fill(120,1,20);  
        translate(this.pos.x, this.pos.y); 
        rotate(this.vel.heading()); 
        rectMode(CENTER); 
        rect(0 , 0, 50, 10);
        ellipse(0, 0, 30); 
        
        pop(); 
    }
    updaterocket()
    {
        this.applyForce(this.dna.genes[count]); 
        this.pos.add(this.vel); 
        this.vel.add(this.acc); 
        this.acc.mult(0); 
    }
    calcFitness()
    {
        var d = dist(this.pos.x , this.pos.y , target.x , target.y); 
        this.fitness = 1/d; 
        if (d<=10)
        {
            this.fitness*=5; 
        }
    }
}

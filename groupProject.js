import {defs, tiny} from './examples/common.js';

const {
    Vector, Vector3, vec, vec3, vec4, color, hex_color, Shader, Matrix, Mat4, Light, Shape, Material, Scene, Texture
} = tiny;

const {Cube, Axis_Arrows, Textured_Phong} = defs

class thing_in_scene{
    //fields
    transform; // object's previous transform matrix
    is_hit = false; // flag indicates if the ball is hit
    camera_lo;
    hit_edge; // flag indicates if it hits the edge
    hit_list; // list of balls it has hit
    coordinate ; //coordinate of the obj in the
    velocity ; // indicates this thing's(most likely ball's) velocity
    color;
    friction_coordinate;
    distance_moved;
    constructor(color,trans_x, trans_y, trans_z, model_transform){
        this.velocity = [0,0,0];
        this.color = color;
        this.transform = model_transform.times(Mat4.translation(trans_x,trans_y,trans_z));
        this.coordinate = [trans_x, trans_y, trans_z];
        this.friction_coordinate = [trans_x, trans_y, trans_z];
        this.hit_list = [];
        this.distance_moved = 0;
    }
}

export class Billiard extends Scene {
    //create field
        //flags
    init = true; // scene need to be initialized at the beginning
    edge_demo_on = false;
    score = 0; // Number of score that the user earned
    white_ball_in_goal = false;
    Cue_angle_increase = false;
    Cue_angle_decrease = false;
    Cue_strength_increase = false;
    Cue_strength_decrease = false;

        //moving objects
    list_of_balls = []; // an array that contains all the balls
    ball_0; // white ball
    ball_1; // yellow ball
    ball_2; // red ball
    ball_3; // TBD
    ball_4; // TBD
    ball_5; // TBD
    ball_6; // TBD
    ball_7; // TBD
    ball_8; // TBD
    ball_9; // TBD
    ball_10; // TBD

        //Score Board
    board;
    score_0;
    score_1;
    score_2;
    score_3;
    score_4;
    score_5;
    score_6;
    score_7;
    score_8;
    score_9;
    score_10;

        //Background
    left_wall;
    right_wall;
    front_wall;
    back_wall;
    floor;

        //cue
    cue;
    cue_angle = 0;
    cue_strength = 0;
    cue_angle_decrease_time = 0;
    cue_angle_increase_time = 0;
    last_time = 0;
    cur_time = 0;
    strength = 0

        //table
    m_table;

    table_edge_left_up;
    table_edge_left_bottom;
    table_edge_right_up;
    table_edge_right_bottom
    table_edge_top;
    table_edge_bottom;

    table_leg_left_up;
    table_leg_right_up;
    table_leg_left_bottom;
    table_leg_right_bottom;

    list_of_pockets = [];
    pocket_1;
    pocket_2;
    pocket_3;
    pocket_4;
    pocket_5;
    pocket_6;

        //ball array
    ball_list;

        //color
    edge_color = hex_color("#3C280D");
    table_color = hex_color("#155843");
    pocket_color = hex_color("#000000");

        //Edge position
    edge_pos = [4];

    constructor() {
        // constructor(): Scenes begin by populating initial values like the Shapes and Materials they'll need.
        super();

        // At the beginning of our program, load one of each of these shape definitions onto the GPU.
        this.shapes = {
            torus: new defs.Torus(15, 15),
            torus2: new defs.Torus(3, 15),
            sphere: new defs.Subdivision_Sphere(4),
            circle: new defs.Regular_2D_Polygon(1, 15),
            cylinder: new defs.Capped_Cylinder(15,15),

            //demo part
            billiard_ball: new defs.Subdivision_Sphere(4),
            table_edge: new defs.Cube(),
            planet1: new (defs.Subdivision_Sphere.prototype.make_flat_shaded_version())(2),
        };

        // *** Materials
        this.materials = {
            test: new Material(new defs.Phong_Shader(),
                {ambient: .4, diffusivity: .6, color: hex_color("#ffffff")}),
            test2: new Material(new Gouraud_Shader(),
                {ambient: .4, diffusivity: .6, color: hex_color("#992828")}),
            sun: new Material(new defs.Phong_Shader(),
                {ambient: 1, diffusivity: 0, specularity: 1, color: hex_color("#ffffff")}),
            cylinder: new Material(new defs.Phong_Shader(),
                {ambient:0.75, diffusivity: 0.6, specularity: 1, color: hex_color("#1221C9")}),

            // demo
            billiard_ball: new Material(new defs.Phong_Shader(),
                {ambient: 0.75, diffusivity:0, specularity: 1, color: hex_color("#ffffff")}),
            table_edge: new Material(new defs.Phong_Shader(),
                {ambient:0.75, diffusivity: 0.6, specularity: 1, color: hex_color("#1221C9")}),
            wallpaper: new Material(new Textured_Phong(), {
                color: hex_color("#ffffff"),
                ambient: 0.5, diffusivity: 0.1, specularity: 0.1,
                texture: new Texture("assets/wallpaper.png")
            }),
            cue: new Material(new defs.Phong_Shader(),
                {ambient:0.75, diffusivity: 0.5, specularity: 0.1, color: hex_color("#444444")}),
            zero: new Material(new Textured_Phong(), {
                color: hex_color("#ffffff"),
                ambient: 0.5, diffusivity: 0.1, specularity: 0.1,
                texture: new Texture("assets/0.png")
            }),
            one: new Material(new Textured_Phong(), {
                color: hex_color("#ffffff"),
                ambient: 0.5, diffusivity: 0.1, specularity: 0.1,
                texture: new Texture("assets/1.png")
            }),
            two: new Material(new Textured_Phong(), {
                color: hex_color("#ffffff"),
                ambient: 0.5, diffusivity: 0.1, specularity: 0.1,
                texture: new Texture("assets/2.png")
            }),
            three: new Material(new Textured_Phong(), {
                color: hex_color("#ffffff"),
                ambient: 0.5, diffusivity: 0.1, specularity: 0.1,
                texture: new Texture("assets/3.png")
            }),
            four: new Material(new Textured_Phong(), {
                color: hex_color("#ffffff"),
                ambient: 0.5, diffusivity: 0.1, specularity: 0.1,
                texture: new Texture("assets/4.png")
            }),
            five: new Material(new Textured_Phong(), {
                color: hex_color("#ffffff"),
                ambient: 0.5, diffusivity: 0.1, specularity: 0.1,
                texture: new Texture("assets/5.png")
            }),
            six: new Material(new Textured_Phong(), {
                color: hex_color("#ffffff"),
                ambient: 0.5, diffusivity: 0.1, specularity: 0.1,
                texture: new Texture("assets/6.png")
            }),
            seven: new Material(new Textured_Phong(), {
                color: hex_color("#ffffff"),
                ambient: 0.5, diffusivity: 0.1, specularity: 0.1,
                texture: new Texture("assets/7.png")
            }),
            eight: new Material(new Textured_Phong(), {
                color: hex_color("#ffffff"),
                ambient: 0.5, diffusivity: 0.1, specularity: 0.1,
                texture: new Texture("assets/8.png")
            }),
            nine: new Material(new Textured_Phong(), {
                color: hex_color("#ffffff"),
                ambient: 0.5, diffusivity: 0.1, specularity: 0.1,
                texture: new Texture("assets/9.png")
            }),
            ten: new Material(new Textured_Phong(), {
                color: hex_color("#ffffff"),
                ambient: 0.5, diffusivity: 0.1, specularity: 0.1,
                texture: new Texture("assets/10.png")
            }),

        }

        // initialize camera location
        this.initial_camera_location = Mat4.look_at(vec3(0, 20, 45), vec3(0, 0, 0), vec3(0, 1, 0));
    }


    make_control_panel() {
        // Draw the scene's buttons, setup their actions and keyboard shortcuts, and monitor live measurements.
        this.key_triggered_button("Reset game", ["Control","r"], () => {this.init = true});
        this.new_line();
        this.key_triggered_button("Rotate the cue clockwise", ["Control","a"], () => {this.Cue_angle_increase = true},"#6E6460", ()=>{this.Cue_angle_increase = false});
        this.key_triggered_button("Rotate the cue counter-clockwise", ["Control","d"], () => {this.Cue_angle_decrease = true},"#6E6460", ()=>{this.Cue_angle_decrease = false});
        this.new_line();
        this.key_triggered_button("Strength increase", ["Control","w"], () => {this.Cue_strength_increase = true},"#6E6460", ()=>{this.Cue_strength_increase = false});
        this.key_triggered_button("Strength decrease", ["Control","s"], () => {this.Cue_strength_decrease = true},"#6E6460", ()=>{this.Cue_strength_decrease = false});
        this.new_line();
        this.key_triggered_button("Cue release", ["Control","h"], () => {this.cue_release = true});
        // this.key_triggered_button("View solar system", ["Control", "0"], () => this.attached = () => this.initial_camera_location);
        // this.new_line();
        // this.key_triggered_button("Attach to planet 1", ["Control", "1"], () => this.attached = () => this.planet_1);
    }

    initialize_Scene(model_transform){
        //initialize edge position
        this.table_size = [-15, 15, -30, 30];
        this.edge_pos = [this.table_size[0]+2, this.table_size[1]-2,this.table_size[2]+2,this.table_size[3]-2,];
        this.score = 0;
        this.cue_angle = 0;
        this.strength = 0.5

        //initialize ball array
        this.list_of_balls = [];

        // objects in the scene
        //balls with different colors
        this.ball_0 = new thing_in_scene(hex_color("#ffffff"),0,2,16.2,model_transform);// ball #0, white ball
        this.ball_1 = new thing_in_scene(hex_color("#fac91a"),0,2,-12,model_transform);// ball #1, yellow ball
        this.ball_2 = new thing_in_scene(hex_color("#FF0000"),-1.2,2,-14,model_transform);// ball #2, red ball
        this.ball_3 = new thing_in_scene(hex_color("#3944BC"),1.2,2,-14,model_transform);// ball #3, blue ball
        this.ball_4 = new thing_in_scene(hex_color("#043927"),-2.2,2,-16,model_transform);// ball #4, dark green ball
        this.ball_5 = new thing_in_scene(hex_color("#E56717"),2.2,2,-16,model_transform);// ball #5, orange ball
        this.ball_6 = new thing_in_scene(hex_color("#FE7F9C"),0,2,-16,model_transform);// ball #6, pink ball
        this.ball_7 = new thing_in_scene(hex_color("#B200ED"),-3.3,2,-18,model_transform);// ball #7, purple ball
        this.ball_8 = new thing_in_scene(hex_color("#000000"),-1.1,2,-18,model_transform);// ball #8, black ball
        this.ball_9 = new thing_in_scene(hex_color("#00FFFF"),1.1,2,-18,model_transform);// ball #9, aqua ball
        this.ball_10 = new thing_in_scene(hex_color("#B0C4DE"),3.3,2,-18,model_transform);// ball #10, grey ball

        //edges
        this.table_edge_left_up = new thing_in_scene(hex_color("#3C280D"), 0,0,0,model_transform); // table edge
        this.table_edge_top = new thing_in_scene(hex_color("#3C280D"), 0,0,0,model_transform);
        this.table_edge_bottom = new thing_in_scene(hex_color("#3C280D"), 0,0,0,model_transform);
        this.table_edge_right_bottom = new thing_in_scene(hex_color("#3C280D"), 0,0,0,model_transform);

        //table legs
        this.table_leg_left_up = new thing_in_scene(hex_color("#3C280D"), 0,0,0,model_transform);
        this.table_leg_right_up = new thing_in_scene(hex_color("#3C280D"), 0,0,0,model_transform);
        this.table_leg_left_bottom = new thing_in_scene(hex_color("#3C280D"), 0,0,0,model_transform);
        this.table_leg_right_bottom = new thing_in_scene(hex_color("#3C280D"), 0,0,0,model_transform);

        //table
        this.m_table = new thing_in_scene(hex_color("#155843"), 0, 0, 0, model_transform);

        //table pockets
        this.pocket_1 = new thing_in_scene(hex_color("#000000"), 0, 0, 0, model_transform);
        this.pocket_2 = new thing_in_scene(hex_color("#000000"), 0, 0, 0, model_transform);
        this.pocket_3 = new thing_in_scene(hex_color("#000000"), 0, 0, 0, model_transform);
        this.pocket_4 = new thing_in_scene(hex_color("#000000"), 0, 0, 0, model_transform);
        this.pocket_5 = new thing_in_scene(hex_color("#000000"), 0, 0, 0, model_transform);
        this.pocket_6 = new thing_in_scene(hex_color("#000000"), 0, 0, 0, model_transform);

        //score board
        this.board = new thing_in_scene(hex_color("#FFFFFF"), 0, 0, 0, model_transform);
        this.score_0 = new thing_in_scene(hex_color("#FFFFFF"), 0, 0, 0, model_transform);
        this.score_1 = new thing_in_scene(hex_color("#FFFFFF"), 0, 0, 0, model_transform);
        this.score_2 = new thing_in_scene(hex_color("#FFFFFF"), 0, 0, 0, model_transform);
        this.score_3 = new thing_in_scene(hex_color("#FFFFFF"), 0, 0, 0, model_transform);
        this.score_4 = new thing_in_scene(hex_color("#FFFFFF"), 0, 0, 0, model_transform);
        this.score_5 = new thing_in_scene(hex_color("#FFFFFF"), 0, 0, 0, model_transform);
        this.score_6 = new thing_in_scene(hex_color("#FFFFFF"), 0, 0, 0, model_transform);
        this.score_7 = new thing_in_scene(hex_color("#FFFFFF"), 0, 0, 0, model_transform);
        this.score_8 = new thing_in_scene(hex_color("#FFFFFF"), 0, 0, 0, model_transform);
        this.score_9 = new thing_in_scene(hex_color("#FFFFFF"), 0, 0, 0, model_transform);
        this.score_10 = new thing_in_scene(hex_color("#FFFFFF"), 0, 0, 0, model_transform);

        //Background
        this.left_wall = new thing_in_scene(hex_color("#FFFFFF"), 0, 0, 0, model_transform);
        this.right_wall = new thing_in_scene(hex_color("#FFFFFF"), 0, 0, 0, model_transform);
        this.front_wall = new thing_in_scene(hex_color("#FFFFFF"), 0, 0, 0, model_transform);
        this.back_wall = new thing_in_scene(hex_color("#FFFFFF"), 0, 0, 0, model_transform);
        this.floor = new thing_in_scene(hex_color("#FFFFFF"), 0, 0, 0, model_transform);

        //cue
        this.cue = new thing_in_scene(hex_color("#989898"), 0, 0, 0, model_transform);

        // push balls in to an array
        this.list_of_balls.push(this.ball_0);
        this.list_of_balls.push(this.ball_1);
        this.list_of_balls.push(this.ball_2);
        this.list_of_balls.push(this.ball_3);
        this.list_of_balls.push(this.ball_4);
        this.list_of_balls.push(this.ball_5);
        this.list_of_balls.push(this.ball_6);
        this.list_of_balls.push(this.ball_7);
        this.list_of_balls.push(this.ball_8);
        this.list_of_balls.push(this.ball_9);
        this.list_of_balls.push(this.ball_10);

        // push pockets into an array
        this.list_of_pockets.push(this.pocket_1);
        this.list_of_pockets.push(this.pocket_2);
        this.list_of_pockets.push(this.pocket_3);
        this.list_of_pockets.push(this.pocket_4);
        this.list_of_pockets.push(this.pocket_5);
        this.list_of_pockets.push(this.pocket_6);

        // set initialize to false, so it won't initialize every frame
        this.init = false;
        this.edge_demo_on = false;
    }

    draw_table_parts(edge,context, program_state, model_transform,tran_x,tran_y,tran_z,scale_x,scale_Y,scale_Z){
        //translate and scale edge;
        edge.transform = model_transform;
        edge.transform = edge.transform.times(Mat4.translation(tran_x,tran_y,tran_z)).
        times(Mat4.scale(scale_x,scale_Y,scale_Z))

        //change coordinate of table
        edge.coordinate = [tran_x,tran_y,tran_z];
        this.shapes.table_edge.draw(context, program_state, edge.transform, this.materials.table_edge.override({color:this.edge_color}));
    }

    draw_table_pocket(pocket, context, program_state, model_transform, tran_x,tran_y,tran_z){
        pocket.transform = model_transform;
        //Rotate first
        //pocket_transform = pocket_transform.times(Mat4.translation(3,-3,0));
        pocket.transform = pocket.transform.times(Mat4.rotation(Math.PI/2, 1, 0, 0));
        pocket.transform = pocket.transform.times(Mat4.translation(tran_x,tran_y,tran_z)).
        times(Mat4.scale(1.2,1.2,2.1));
        //Record the coordinate
        pocket.coordinate = [tran_x,tran_y,tran_z];
        this.shapes.cylinder.draw(context, program_state, pocket.transform, this.materials.cylinder.override({color:this.pocket_color}));
    }

    draw_strength_bar(context, program_state, model_transform){
        let bar_transform = model_transform;
        bar_transform = bar_transform.times(Mat4.translation(this.ball_0.coordinate[0] - 5,10,this.ball_0.coordinate[2]))
            .times(Mat4.scale(1,this.strength * 5,1));
        this.shapes.table_edge.draw(context, program_state,bar_transform,this.materials.table_edge);

    }

    draw_cue(context, program_state, model_transform, tran_x,tran_y,tran_z,t){
        this.cue.transform = model_transform;

        if(this.Cue_angle_decrease){
            let time_diff = t - this.last_time;
            this.cue_angle += (2/3)*(Math.PI*time_diff);
        }
        if(this.Cue_angle_increase){
            let time_diff = t - this.last_time;
            this.cue_angle -= (2/3)*(Math.PI*time_diff);
        }
        this.last_time= t
        this.cue.transform = this.cue.transform.times(Mat4.translation(tran_x, tran_y, tran_z))
            .times(Mat4.rotation(this.cue_angle,0,1,0))
            .times(Mat4.translation(0, 0, 15))
            .times(Mat4.scale(0.2, 0.2, 20));
        this.shapes.cylinder.draw(context, program_state, this.cue.transform, this.materials.cue);


        if(this.Cue_strength_increase){
            if(this.strength <1) {
                this.strength += 0.005;
            }
        }
        if(this.Cue_strength_decrease){
            if(this.strength > 0) {
                this.strength -= 0.005;
            }
        }
        console.log("strength: ", this.strength);
        this.draw_strength_bar(context, program_state, model_transform)
        // hit the cue ball based on the angle of cue
        if(this.cue_release){
            let x =((this.cue_angle)%(2*Math.PI) + 2*Math.PI) % (2*Math.PI);
            console.log("angle x: ", x);
            //case 1: x >= 0 and x < pi/2
            if(x>=0 && x<(Math.PI/2)){
                console.log("first quartile");
                this.ball_0.velocity = [- Math.sin(x) * this.strength, 0, -Math.cos(x) * this.strength];
            }
            //case 2: x >= pi/2 and x < pi
            if(x>=Math.PI/2 && x<(Math.PI)){
                console.log("second quartile");
                x = x - Math.PI/2;
                this.ball_0.velocity = [-Math.cos(x)*this.strength,0,Math.sin(x)*this.strength];

            }
            //case 3: x >= pi and x < 3pi/2
            if(x>=Math.PI && x<((Math.PI*3)/2)){
                console.log("third quartile");
                x = x - Math.PI;
                this.ball_0.velocity = [Math.sin(x)*this.strength,0,Math.cos(x)*this.strength];

            }
            //case 4: x >= 3pi/2 and x < 2pi
            if(x>=(Math.PI*3)/2 && x<(Math.PI*2)){
                console.log("forth quartile");
                x = x - (Math.PI*3)/2;
                this.ball_0.velocity = [Math.cos(x)*this.strength,0,-Math.sin(x)*this.strength];
            }
            this.cue_release = false;
        }
    }

    draw_board(context, program_state, model_transform){
        //this.board.transform = model_transform;
        //this.board.transform = this.board.transform.times(Mat4.rotation(Math.PI/10, 0, 1, 0));
        model_transform = model_transform.times(Mat4.translation(10, 5, -99.8))
            .times(Mat4.scale(10, 10, 0.2));
        if(this.score === 0)
            this.shapes.table_edge.draw(context, program_state, model_transform, this.materials.zero);
        else if(this.score === 1)
            this.shapes.table_edge.draw(context, program_state, model_transform, this.materials.one);
        else if(this.score === 2)
            this.shapes.table_edge.draw(context, program_state, model_transform, this.materials.two);
        else if(this.score === 3)
            this.shapes.table_edge.draw(context, program_state, model_transform, this.materials.three);
        else if(this.score === 4)
            this.shapes.table_edge.draw(context, program_state, model_transform, this.materials.four);
        else if(this.score === 5)
            this.shapes.table_edge.draw(context, program_state, model_transform, this.materials.five);
        else if(this.score === 6)
            this.shapes.table_edge.draw(context, program_state, model_transform, this.materials.six);
        else if(this.score === 7)
            this.shapes.table_edge.draw(context, program_state, model_transform, this.materials.seven);
        else if(this.score === 8)
            this.shapes.table_edge.draw(context, program_state, model_transform, this.materials.eight);
        else if(this.score === 9)
            this.shapes.table_edge.draw(context, program_state, model_transform, this.materials.nine);
        else if(this.score === 10)
            this.shapes.table_edge.draw(context, program_state, model_transform, this.materials.ten);
        //this.shapes.table_edge.draw(context, program_state, this.board.transform, this.materials.table_edge.override({color:hex_color("#FFA07A")}));
    }

    draw_wall(wall, context, program_state, model_transform,tran_x,tran_y,tran_z,scale_x,scale_Y,scale_Z){
        wall.transform = model_transform;
        wall.transform = wall.transform.times(Mat4.translation(tran_x,tran_y,tran_z)).
        times(Mat4.scale(scale_x,scale_Y,scale_Z));
        this.shapes.table_edge.draw(context, program_state, wall.transform, this.materials.wallpaper);
    }

    draw_background(context, program_state, model_transform){
        this.draw_wall(this.floor, context, program_state, model_transform, 0, -16, 0, 100, 0.2, 100);
        this.draw_wall(this.left_wall, context, program_state, model_transform, -100, 84, 0, 0.2, 100, 100);
        this.draw_wall(this.front_wall, context, program_state, model_transform, 0, 84, -100, 100, 100, 0.2);
        this.draw_wall(this.right_wall, context, program_state, model_transform, 100, 84, 0, 0.2, 100, 100);
        this.draw_wall(this.back_wall, context, program_state, model_transform, 0, 84, 100, 100, 100, 0.2);
    }

    draw_table(context, program_state, model_transform, t){
        this.draw_table_parts(this.table_edge_left_up, context, program_state, model_transform,this.table_size[0],0.5,0,1,1.5,this.table_size[3]+1);
        this.draw_table_parts(this.table_edge_top, context, program_state, model_transform,0,0.5,this.table_size[2],this.table_size[1],1.5,1);
        this.draw_table_parts(this.table_edge_bottom, context, program_state, model_transform, this.table_size[1], 0.5, 0, 1, 1.5, this.table_size[3]+1);
        this.draw_table_parts(this.table_edge_right_bottom, context, program_state, model_transform, 0, 0.5, this.table_size[3], this.table_size[1], 1.5, 1);

        //draw table
        let table_transform = model_transform;
        table_transform = table_transform.times(Mat4.translation(0,0,0)).
                        times(Mat4.scale(this.table_size[1], 1, this.table_size[3]));
        this.shapes.table_edge.draw(context, program_state, table_transform, this.materials.table_edge.override({color:this.table_color}));

        //draw legs
        this.draw_table_parts(this.table_leg_left_up, context, program_state, model_transform,this.edge_pos[0],this.edge_pos[0],this.edge_pos[2],1,this.edge_pos[1],1);
        this.draw_table_parts(this.table_leg_left_bottom, context, program_state, model_transform,this.edge_pos[0],this.edge_pos[0],this.edge_pos[3],1,this.edge_pos[1],1);
        this.draw_table_parts(this.table_leg_right_bottom, context, program_state, model_transform,this.edge_pos[1],this.edge_pos[0],this.edge_pos[2],1,this.edge_pos[1],1);
        this.draw_table_parts(this.table_leg_right_up, context, program_state, model_transform,this.edge_pos[1],this.edge_pos[0],this.edge_pos[3],1,this.edge_pos[1],1);

        //draw pocket
        this.draw_table_pocket(this.pocket_1, context, program_state, model_transform,this.table_size[0]+1.5,this.table_size[2]+1.5,-1);
        this.draw_table_pocket(this.pocket_2, context, program_state, model_transform,this.table_size[0]+1,0,-1);
        this.draw_table_pocket(this.pocket_3, context, program_state, model_transform,this.table_size[0]+1.5,this.table_size[3]-1.5,-1);
        this.draw_table_pocket(this.pocket_4, context, program_state, model_transform,this.table_size[1]-1.5,this.table_size[2]+1.5,-1);
        this.draw_table_pocket(this.pocket_5, context, program_state, model_transform,this.table_size[1]-1,0,-1);
        this.draw_table_pocket(this.pocket_6, context, program_state, model_transform,this.table_size[1]-1.5,this.table_size[3]-1.5,-1);

    }

    // TODO: goal detection
    goal(){
        let i = 0;
        for(i = 0; i < this.list_of_balls.length; i++){
            let ball = this.list_of_balls[i];
            if(this.is_in_goal(ball)){
                if(this.equal(ball,this.ball_0)){
                    //White ball hit in goal
                    this.white_ball_in_goal = true;
                    /*
                    ball.coordinate[0] = 10000;
                    ball.coordinate[2] = 10000;
                     */
                    ball.velocity[0] = 0;
                    ball.velocity[2] = 0;
                    this.score--;
                }
                //delete ball
                //else{
                this.score ++;
                this.list_of_balls.splice(i, 1);
                ball.is_hit = true;
                //}
                //ball.is_hit = false;
            }
        }
    }

    is_in_goal(ball){
        if(this.collide_with_edge(ball)){
            if((ball.coordinate[0] < this.edge_pos[0]+1)
                && (ball.coordinate[2] < this.edge_pos[2]+1)){
                return true;
            }
            if((ball.coordinate[0] < this.edge_pos[0]+1)&&
                (ball.coordinate[2] < 1)&&
                (ball.coordinate[2] > -1)){
                return true;
            }
            if((ball.coordinate[0] < this.edge_pos[0]+1)
                && (ball.coordinate[2] > this.edge_pos[3]-1)){
                return true;
            }
            if((ball.coordinate[0] > this.edge_pos[1]-1)
                && (ball.coordinate[2] < this.edge_pos[2]+1)){
                return true;
            }
            if((ball.coordinate[0] > this.edge_pos[1]-1)&&
                (ball.coordinate[2] < 1)&&
                (ball.coordinate[2] > -1)){
                return true;
            }
            if((ball.coordinate[0] > this.edge_pos[1]-1)
                && (ball.coordinate[2] > this.edge_pos[3]-1)){
                return true;
            }
        }
        return false;
    }

    //Check if the position is colliding with any other balls
    is_collide(ball){
        let i = 0;
        for(i = 0; i < this.list_of_balls.length; i++){
            if(this.collide(ball, this.list_of_balls[i]))
                return true;
        }
        return false;
    }

    collide(b1, b2){
        let distance = ((b1.coordinate[0] - b2.coordinate[0])**2) + ((b1.coordinate[2] - b2.coordinate[2])**2);
        if ( distance <= 2.1**2){
            return true;
        }
        return false;
    }

    collide_with_edge(cur_ball){
        if (cur_ball.coordinate[0] <= this.edge_pos[0] || cur_ball.coordinate[0] >= this.edge_pos[1])
            return true;
        return (cur_ball.coordinate[2] <= this.edge_pos[2] || cur_ball.coordinate[2] >= this.edge_pos[3]);

    }

    collide_with_edge_detection(){
        let i = 0;
        for(i = 0; i < this.list_of_balls.length; i++){
            let cur_ball = this.list_of_balls[i];
            if (cur_ball.coordinate[0] <= this.edge_pos[0] || cur_ball.coordinate[0] >= this.edge_pos[1]){
                cur_ball.velocity[0] = -0.8 * cur_ball.velocity[0]; // reverse vertical velocity
                cur_ball.velocity[2] = 0.8 * cur_ball.velocity[2];
                if(cur_ball.coordinate[0] < this.edge_pos[0]){
                    cur_ball.coordinate[0] = this.edge_pos[0];
                }else{
                    cur_ball.coordinate[0] = this.edge_pos[1];
                }

            }
            if (cur_ball.coordinate[2] <= this.edge_pos[2] || cur_ball.coordinate[2] >= this.edge_pos[3]){
                cur_ball.velocity[2] = -0.8 * cur_ball.velocity[2]; // reverse horizontal velocity and reduce speed 20 pct due to energy loss
                cur_ball.velocity[0] = 0.8 * cur_ball.velocity[0];
                if(cur_ball.coordinate[2] < this.edge_pos[2]){
                    cur_ball.coordinate[2] = this.edge_pos[2];
                }else{
                    cur_ball.coordinate[2] = this.edge_pos[3];
                }
            }
        }


    }

    // compute dot product between two vectors, helper method of impact
    dot(v1,v2){
        let i = 0;
        let sum = 0
        for(i;i<3;i++){
            sum += v1[i] * v2[i]
        }
        return sum;
    }

    // helper method for collision_btw_balls_detection
    // changes velocity of ball 0 and ball 1
    impact(b1,b2){
        // b1.velocity = [0,0,0];
        // b2.velocity = [0,0,0];
        // get normal of two point
        let i = 0;
        let normal = []
        let normalize_factor = 0
        for(i; i < 3; i++){
            let coor_diff = b2.coordinate[i] - b1.coordinate[i];
            normal.push(coor_diff);
            normalize_factor += coor_diff**2;
        }
        // normalization
        i = 0
        for(i; i < 3; i++){
            normal[i] = normal[i]/(normalize_factor**(1/2))
        }
        // compute initial velocity on normal
        let v1n_0 = this.dot(b1.velocity,normal);
        let v2n_0 = this.dot(b2.velocity,normal);
        // compute velocity
        let vrn = v1n_0 - v2n_0;//vr is relative velocity of v1 respect to v2
        // compute impulse on normal
        let impulse = -vrn;
        let impulse_on_x = impulse * normal[0];
        let impulse_on_y = impulse * normal[2];
        // compute velocity of two balls after collision
        // b1.velocity[0] =  b1.velocity[0] +  impulse_on_x;
        // b1.velocity[2] =  b1.velocity[2] + impulse_on_y;
        // b2.velocity[0] = b2.velocity[0] - impulse_on_x;
        // b2.velocity[2] = b2.velocity[2] - impulse_on_y;
        b1.velocity[0] = (b1.velocity[0] +  impulse_on_x) * 0.95;
        b1.velocity[2] =  (b1.velocity[2] + impulse_on_y) * 0.95;
        b2.velocity[0] = (b2.velocity[0] - impulse_on_x) * 0.95;
        b2.velocity[2] = (b2.velocity[2] - impulse_on_y) * 0.95;
        b1.hit_list.push(b2);
        b2.hit_list.push(b1);
        // this.relocate_ball_after_collision(b1,b2);
    }

    // help method for testing if two points are the same.
    equal(b1, b2){
        if((b1.coordinate[0] === b2.coordinate[0]) && (b1.coordinate[2] === b2.coordinate[2])){
            return true;
        }
        return false;
    }

    //test if b1 is b2's hitlist
    is_not_in_hitList(b1,b2){
        let i = 0
        for(i = 0; i < b2.hit_list.length;i++){
            if(this.equal(b1,b2.hit_list[i])){
                return false;
            }
        }
        return true;
    }

    //clear all balls' hit lists
    clear_hit_list(){
        let i = 0;
        for (i = 0;i<this.list_of_balls.length;i++){
            this.list_of_balls[i].hit_list = [];
        }
    }

    collision_btw_balls_detection(){
        let i = 0;
        let j = 0;
        for (i = 0;i<this.list_of_balls.length;i++){
            for (j = 0;j<this.list_of_balls.length;j++){
                let ball1 = this.list_of_balls[i];
                let ball2 = this.list_of_balls[j];
                if(this.equal(ball1,ball2)){// if ball0 is ball 1, we don't need to test collision
                    continue;
                }else{
                   if((this.collide(ball1,ball2)) &&(this.is_not_in_hitList(ball1,ball2))){ // if ball 0 and ball 1 collide and ball 1 hasn't collide with ball 0
                       this.impact(ball1,ball2);
                   }
                }
            }
        }
        this.clear_hit_list();
    }

    draw_moving_ball(context, program_state, ball){
        // change ball's transform based on collision status
        ball.transform = ball.transform.times(Mat4.translation(ball.velocity[0],0,ball.velocity[2]));

        //change coordinate based on ball's velocity
        ball.coordinate[0] = ball.coordinate[0] + ball.velocity[0];
        ball.coordinate[2] = ball.coordinate[2] + ball.velocity[2];

        //draw ball
        this.shapes.billiard_ball.draw(context, program_state, ball.transform, this.materials.billiard_ball.override({color: ball.color}));
        //ball = Mat4.inverse(ball.transform.times(Mat4.translation(0, 0, 5)));
    }

    is_stop(){
        let i = 0;
        for(i = 0; i < this.list_of_balls.length; i++){
            let cur_ball = this.list_of_balls[i];
            if(!(cur_ball.velocity[0] === 0) || !(cur_ball.velocity[2] === 0))
                return false;
        }
        return true;
    }

    randomNumber(min, max) {
        return Math.random() * (max - min) + min;
    }

    update_white_ball(model_transform){
        //If white ball is in goal and all other ball stopped,
        //put the white ball back in a random spot
        if(this.white_ball_in_goal && this.is_stop()){
            //Set a random spot
            let x = this.ball_0.coordinate[0] = this.randomNumber(this.edge_pos[0],this.edge_pos[1]);
            let z = this.ball_0.coordinate[2] = this.randomNumber(this.edge_pos[2],this.edge_pos[3]);
            while (this.is_collide(this.ball_0)){
                x = this.ball_0.coordinate[0] = this.randomNumber(this.edge_pos[0],this.edge_pos[1]);
                z = this.ball_0.coordinate[2] = this.randomNumber(this.edge_pos[2],this.edge_pos[3]);
            }
            this.ball_0 = new thing_in_scene(hex_color("#ffffff"),this.ball_0.coordinate[0],2,this.ball_0.coordinate[2],model_transform);
            //this.ball_0.transform = model_transform;
            //this.ball_0.transform = this.list_of_balls[0].transform.times(Mat4.translation(x, 0, z));
            this.list_of_balls.unshift(this.ball_0);
            //this.list_of_balls[0].transform = model_transform;
            //this.list_of_balls[0].transform = this.list_of_balls[0].transform.times(Mat4.translation(x, 0, z));
            this.white_ball_in_goal = false;
        }
    }

    update_velocity_friction(){
        let i = 0;
        for(i = 0; i < this.list_of_balls.length; i++){
            let cur_ball = this.list_of_balls[i];
            if( Math.abs(cur_ball.velocity[0]) <= 0.05 &&  Math.abs(cur_ball.velocity[2]) <= 0.05){ // if the velocity of ball is smaller than certain threshold, ball will stop.
                if(cur_ball.distance_moved >= 0.3){ //after the ball move 3 unit distance, apply faster friction
                    cur_ball.velocity[0] = cur_ball.velocity[0] * 0.9 ;
                    cur_ball.velocity[2] = cur_ball.velocity[2] * 0.9 ;
                    // update ball's distance moved for next friction speed deduction
                    cur_ball.distance_moved = 0;
                }
            }
            else if( Math.abs(cur_ball.velocity[0]) <= 0.02 &&  Math.abs(cur_ball.velocity[2]) <= 0.02){ // if the velocity of ball is smaller than certain threshold, ball will stop.
                if(cur_ball.distance_moved >= 0.3){ //after the ball move 3 unit distance, apply faster friction
                    cur_ball.velocity[0] = cur_ball.velocity[0] * 0.6 ;
                    cur_ball.velocity[2] = cur_ball.velocity[2] * 0.6 ;
                    // update ball's distance moved for next friction speed deduction
                    cur_ball.distance_moved = 0;
                }
            }
            else if( Math.abs(cur_ball.velocity[0]) <= 0.01 &&  Math.abs(cur_ball.velocity[2]) <= 0.01){ // if the velocity of ball is smaller than certain threshold, ball will stop.
                if(cur_ball.distance_moved >= 0.3){ //after the ball move 3 unit distance, apply faster friction
                    cur_ball.velocity[0] = cur_ball.velocity[0] * 0.3 ;
                    cur_ball.velocity[2] = cur_ball.velocity[2] * 0.3 ;
                    // update ball's distance moved for next friction speed deduction
                    cur_ball.distance_moved = 0;
                }
            }
            else if(cur_ball.distance_moved >= 0.3){ //after the ball move 0.3 unit distance, apply friction
                cur_ball.velocity[0] = cur_ball.velocity[0] * 0.99 ;
                cur_ball.velocity[2] = cur_ball.velocity[2] * 0.99 ;
                // update ball's distance moved for next friction speed deduction
                cur_ball.distance_moved = 0;
            }
            if(cur_ball.hit_list.length === 0){
                if( Math.abs(cur_ball.velocity[0]) <= 0.005 &&  Math.abs(cur_ball.velocity[2]) <= 0.005){
                    // if the velocity of ball is smaller than certain threshold, ball will stop.
                    cur_ball.velocity[0] = 0;
                    cur_ball.velocity[2] = 0;
                }
            }
            let distance = ((cur_ball.velocity[0]**2) + (cur_ball.velocity[2]**2))**(1/2);
            cur_ball.distance_moved += distance
        }
    }

    draw_everything(context, program_state, model_transform, t){

            //detects for goal
            this.goal();

            // detects if ball collides with other balls
            this.collision_btw_balls_detection();

            // detect if ball collides with edges
            this.collide_with_edge_detection();

            //update velocity
            this.update_velocity_friction();

            //update the white ball status
            this.update_white_ball(model_transform);

            //Draw ball
            let i = 0
            for(i = 0; i < this.list_of_balls.length; i++){
                let cur_ball = this.list_of_balls[i];
                this.draw_moving_ball(context, program_state,cur_ball);
                //this.list_of_balls[i].camera_lo = Mat4.inverse(this.list_of_balls[i].transform.times(Mat4.translation(0, 0, 5)));
            }
        this.draw_board(context, program_state, model_transform);
        // draw cue

    }


    display(context, program_state) {
        // display():  Called once per frame of animation.
        // Setup -- This part sets up the scene's overall camera matrix, projection matrix, and lights:
        if (!context.scratchpad.controls) {
            this.children.push(context.scratchpad.controls = new defs.Movement_Controls());
            // Define the global camera and projection matrices, which are stored in program_state.
            program_state.set_camera(this.initial_camera_location);
        }

        program_state.projection_transform = Mat4.perspective(
            Math.PI / 4, context.width / context.height, .1, 1000);

        //define color and animation time t
        const t = program_state.animation_time / 1000, dt = program_state.animation_delta_time / 1000;
        const yellow = hex_color("#fac91a");
        let model_transform = Mat4.identity();

        //lighting
        const light_position = vec4(0, 300, 0, 1);
        program_state.lights = [new Light(light_position, color(1,1,1,1), 10**15)];// The parameters of the Light are: position, color, size

        //initialize the scene
        if(this.init === true){
            this.initialize_Scene(model_transform);
        }
        this.draw_table(context,program_state,model_transform,t);
        this.draw_everything(context, program_state, model_transform, t);
        this.draw_background(context, program_state, model_transform);
        if(this.is_stop())
            this.draw_cue(context, program_state, model_transform, this.ball_0.coordinate[0],this.ball_0.coordinate[1],this.ball_0.coordinate[2],t);
    }
}

class Gouraud_Shader extends Shader {
    // This is a Shader using Phong_Shader as template
    // TODO: Modify the glsl coder here to create a Gouraud Shader (Planet 2)

    constructor(num_lights = 2) {
        super();
        this.num_lights = num_lights;
    }

    shared_glsl_code() {
        // ********* SHARED CODE, INCLUDED IN BOTH SHADERS *********
        return `
        precision mediump float;
        const int N_LIGHTS = ` + this.num_lights + `;
        uniform float ambient, diffusivity, specularity, smoothness;
        uniform vec4 light_positions_or_vectors[N_LIGHTS], light_colors[N_LIGHTS];
        uniform float light_attenuation_factors[N_LIGHTS];
        uniform vec4 shape_color;
        uniform vec3 squared_scale, camera_center;

        // Specifier "varying" means a variable's final value will be passed from the vertex shader
        // on to the next phase (fragment shader), then interpolated per-fragment, weighted by the
        // pixel fragment's proximity to each of the 3 vertices (barycentric interpolation).
        varying vec3 N, vertex_worldspace;
        varying vec4 vertexColor;
        // ***** PHONG SHADING HAPPENS HERE: *****
        vec3 phong_model_lights( vec3 N, vec3 vertex_worldspace ){
            // phong_model_lights():  Add up the lights' contributions.
            vec3 E = normalize( camera_center - vertex_worldspace );
            vec3 result = vec3( 0.0 );
            for(int i = 0; i < N_LIGHTS; i++){
                // Lights store homogeneous coords - either a position or vector.  If w is 0, the
                // light will appear directional (uniform direction from all points), and we
                // simply obtain a vector towards the light by directly using the stored value.
                // Otherwise if w is 1 it will appear as a point light -- compute the vector to
                // the point light's location from the current surface point.  In either case,
                // fade (attenuate) the light as the vector needed to reach it gets longer.
                vec3 surface_to_light_vector = light_positions_or_vectors[i].xyz -
                                               light_positions_or_vectors[i].w * vertex_worldspace;
                float distance_to_light = length( surface_to_light_vector );

                vec3 L = normalize( surface_to_light_vector );
                vec3 H = normalize( L + E );
                // Compute the diffuse and specular components from the Phong
                // Reflection Model, using Blinn's "halfway vector" method:
                float diffuse  =      max( dot( N, L ), 0.0 );
                float specular = pow( max( dot( N, H ), 0.0 ), smoothness );
                float attenuation = 1.0 / (1.0 + light_attenuation_factors[i] * distance_to_light * distance_to_light );

                vec3 light_contribution = shape_color.xyz * light_colors[i].xyz * diffusivity * diffuse
                                                          + light_colors[i].xyz * specularity * specular;
                result += attenuation * light_contribution;
            }
            return result;
        } `;
    }

    vertex_glsl_code() {
        // ********* VERTEX SHADER *********
        return this.shared_glsl_code() + `
            attribute vec3 position, normal;
            // Position is expressed in object coordinates.

            uniform mat4 model_transform;
            uniform mat4 projection_camera_model_transform;

            void main(){
                // The vertex's final resting place (in NDCS):
                gl_Position = projection_camera_model_transform * vec4( position, 1.0 );
                // The final normal vector in screen space.
                N = normalize( mat3( model_transform ) * normal / squared_scale);
                vertex_worldspace = ( model_transform * vec4( position, 1.0 ) ).xyz;

                // Compute an initial (ambient) color:
                vertexColor = vec4(shape_color.xyz * ambient, shape_color.w );
                // Compute the final color with contributions from lights:
                vertexColor.xyz += phong_model_lights(normalize(N), vertex_worldspace );
            } `;
    }

    fragment_glsl_code() {
        // ********* FRAGMENT SHADER *********
        // A fragment is a pixel that's overlapped by the current triangle.
        // Fragments affect the final image or get discarded due to depth.
        return this.shared_glsl_code() + `
            void main(){
                gl_FragColor = vertexColor;
                return;
            } `;
    }

    send_material(gl, gpu, material) {
        // send_material(): Send the desired shape-wide material qualities to the
        // graphics card, where they will tweak the Phong lighting formula.
        gl.uniform4fv(gpu.shape_color, material.color);
        gl.uniform1f(gpu.ambient, material.ambient);
        gl.uniform1f(gpu.diffusivity, material.diffusivity);
        gl.uniform1f(gpu.specularity, material.specularity);
        gl.uniform1f(gpu.smoothness, material.smoothness);
    }

    send_gpu_state(gl, gpu, gpu_state, model_transform) {
        // send_gpu_state():  Send the state of our whole drawing context to the GPU.
        const O = vec4(0, 0, 0, 1), camera_center = gpu_state.camera_transform.times(O).to3();
        gl.uniform3fv(gpu.camera_center, camera_center);
        // Use the squared scale trick from "Eric's blog" instead of inverse transpose matrix:
        const squared_scale = model_transform.reduce(
            (acc, r) => {
                return acc.plus(vec4(...r).times_pairwise(r))
            }, vec4(0, 0, 0, 0)).to3();
        gl.uniform3fv(gpu.squared_scale, squared_scale);
        // Send the current matrices to the shader.  Go ahead and pre-compute
        // the products we'll need of the of the three special matrices and just
        // cache and send those.  They will be the same throughout this draw
        // call, and thus across each instance of the vertex shader.
        // Transpose them since the GPU expects matrices as column-major arrays.
        const PCM = gpu_state.projection_transform.times(gpu_state.camera_inverse).times(model_transform);
        gl.uniformMatrix4fv(gpu.model_transform, false, Matrix.flatten_2D_to_1D(model_transform.transposed()));
        gl.uniformMatrix4fv(gpu.projection_camera_model_transform, false, Matrix.flatten_2D_to_1D(PCM.transposed()));

        // Omitting lights will show only the material color, scaled by the ambient term:
        if (!gpu_state.lights.length)
            return;

        const light_positions_flattened = [], light_colors_flattened = [];
        for (let i = 0; i < 4 * gpu_state.lights.length; i++) {
            light_positions_flattened.push(gpu_state.lights[Math.floor(i / 4)].position[i % 4]);
            light_colors_flattened.push(gpu_state.lights[Math.floor(i / 4)].color[i % 4]);
        }
        gl.uniform4fv(gpu.light_positions_or_vectors, light_positions_flattened);
        gl.uniform4fv(gpu.light_colors, light_colors_flattened);
        gl.uniform1fv(gpu.light_attenuation_factors, gpu_state.lights.map(l => l.attenuation));
    }

    update_GPU(context, gpu_addresses, gpu_state, model_transform, material) {
        // update_GPU(): Define how to synchronize our JavaScript's variables to the GPU's.  This is where the shader
        // recieves ALL of its inputs.  Every value the GPU wants is divided into two categories:  Values that belong
        // to individual objects being drawn (which we call "Material") and values belonging to the whole scene or
        // program (which we call the "Program_State").  Send both a material and a program state to the shaders
        // within this function, one data field at a time, to fully initialize the shader for a draw.

        // Fill in any missing fields in the Material object with custom defaults for this shader:
        const defaults = {color: color(0, 0, 0, 1), ambient: 0, diffusivity: 1, specularity: 1, smoothness: 40};
        material = Object.assign({}, defaults, material);

        this.send_material(context, gpu_addresses, material);
        this.send_gpu_state(context, gpu_addresses, gpu_state, model_transform);
    }
}



class Ring_Shader extends Shader {
    update_GPU(context, gpu_addresses, graphics_state, model_transform, material) {
        // update_GPU():  Defining how to synchronize our JavaScript's variables to the GPU's:
        const [P, C, M] = [graphics_state.projection_transform, graphics_state.camera_inverse, model_transform],
            PCM = P.times(C).times(M);
        context.uniformMatrix4fv(gpu_addresses.model_transform, false, Matrix.flatten_2D_to_1D(model_transform.transposed()));
        context.uniformMatrix4fv(gpu_addresses.projection_camera_model_transform, false,
            Matrix.flatten_2D_to_1D(PCM.transposed()));
    }

    shared_glsl_code() {
        // ********* SHARED CODE, INCLUDED IN BOTH SHADERS *********
        return `
        precision mediump float;
        varying vec4 point_position;
        varying vec4 center;
        `;
    }

    vertex_glsl_code() {
        // ********* VERTEX SHADER *********
        // TODO:  Complete the main function of the vertex shader (Extra Credit Part II).
        return this.shared_glsl_code() + `
        attribute vec3 position;
        uniform mat4 model_transform;
        uniform mat4 projection_camera_model_transform;

        void main(){
          center =  model_transform * vec4(0, 0, 0, 1) ;
          point_position = model_transform * vec4(position, 1);
          gl_Position = projection_camera_model_transform * vec4(position, 1);
        }`;
    }

    fragment_glsl_code() {
        // ********* FRAGMENT SHADER *********
        // TODO:  Complete the main function of the fragment shader (Extra Credit Part II).
        return this.shared_glsl_code() + `
        void main(){
             // RGB pct value of color #B08040: 0.69, 0.502, 0.251
             gl_FragColor = vec4(0.69, 0.502, 0.251, sin(20.0 * distance(point_position, center)));//sinusoidal scalar has to be float
        }`;
    }
}


// test ball and ball collision
// // Online Javascript Editor for free
// // Write, Edit and Run your Javascript code using JS Online Compiler
// v1 = [0,0,-5];
// v2 = [-5,0,0];
//
// let ball_1_coor= [-4,0,3];
// let ball_2_coor= [0,0,0];
// let ball_1_mass = 1
// let ball_2_mass = 1
// const e = 1;
//
// // get normal of two point
// let i = 0;
// let normal = []
// let normalize_factor = 0
// for(i; i < 3; i++){
//     let coor_diff = ball_2_coor[i] - ball_1_coor[i]
//     normal.push(coor_diff)
//     normalize_factor += coor_diff**2
// }
// console.log("normal: ", normal)
//
// // normalization
// i = 0
// for(i; i < 3; i++){
//     normal[i] = normal[i]/(normalize_factor**(1/2))
// }
// console.log("normalized normal: ", normal)
//
// // get velocity on normal
// function dot(v1,v2){
//     let i = 0;
//     let sum = 0
//     for(i;i<3;i++){
//         sum += v1[i] * v2[i]
//     }
//     return sum;
// }
//
// let v1n_0 = dot(v1,normal);
// let v2n_0 = dot(v2,normal);
// console.log("v1 initial normal velocity: ", v1n_0)
// console.log("v2 initial normal velocity: ", v2n_0)
//
// // compute velocity
// let vrn = v1n_0 - v2n_0;//vr is relation velocity of v1 respect to v2
// console.log("vrn: ", vrn)
//
// //normal impulse
// impulse = (-vrn*(1+e))/((1/ball_1_mass)+(1/ball_2_mass))
// console.log("normal impulse: ", impulse)
// impulse_on_x = impulse * normal[0]
// impulse_on_y = impulse * normal[2]
// console.log("normal impulse on x: ", impulse_on_x)
// console.log("normal impulse on y: ", impulse_on_y)
//
// let b1_vx = v1[0] + (1/ball_1_mass) * impulse_on_x
// let b1_vy = v1[2] + (1/ball_1_mass) * impulse_on_y
// let b2_vx = v2[0] - (1/ball_2_mass) * impulse_on_x
// let b2_vy = v2[2] - (1/ball_2_mass) * impulse_on_y
// console.log("final velocity of v1: [",b1_vx," , ", b1_vy,"]", (((b1_vx**2) + (b1_vy**2))**(1/2)) )
// console.log("final velocity of v2: [",b2_vx," , ", b2_vy,"]", (((b2_vx**2) + (b2_vy**2))**(1/2)) )

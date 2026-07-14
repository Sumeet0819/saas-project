import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

// Helper for random choices
const randomItem = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomDate = (start: Date, end: Date) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString().split('T')[0];

async function clearData() {
  console.log('Clearing existing data...');
  const tables = ['notifications', 'site_photos', 'site_issues', 'equipment', 'deliveries', 'material_requests', 'material_logs', 'material_inventory', 'attendance', 'workers', 'site_activities', 'daily_logs', 'project_members', 'projects', 'users', 'organizations', 'suppliers', 'material_master'];

  for (const table of tables) {
    const { error } = await supabase.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (error) console.error(`Error deleting from ${table}:`, error.message);
  }

  const { data: authData, error: listError } = await supabase.auth.admin.listUsers();
  if (!listError && authData && authData.users) {
    for (const u of authData.users) {
      if (u.email?.endsWith('@test.com')) await supabase.auth.admin.deleteUser(u.id);
    }
  }
  console.log('Data cleared.');
}

async function seedData() {
  console.log('Starting BULK seed process...');
  
  // 1. Organizations
  console.log('Seeding organizations...');
  const { data: orgs, error: orgErr } = await supabase.from('organizations').insert([
    { name: 'Apex Construction', phone: '1234567890', email: 'contact@apex.com', address: '123 Main St, Tech City' }
  ]).select();
  if (orgErr || !orgs) throw orgErr;
  const orgId = orgs[0].id;

  // 2. Users (Auth + Public)
  console.log('Seeding users...');
  const roles = ['Admin', 'Project Manager', 'Site Engineer', 'Contractor', 'Supplier'];
  const testUsers = [];
  
  for (const role of roles) {
    const email = `${role.toLowerCase().replace(' ', '')}@test.com`;
    const { data: authUser, error: authErr } = await supabase.auth.admin.createUser({ email, password: 'password123', email_confirm: true });
    if (authErr) throw authErr;
    
    const { data: pubUser, error: pubErr } = await supabase.from('users').insert({
      id: authUser.user.id, organization_id: orgId, full_name: `Test ${role}`, email, role
    }).select();
    if (pubErr) throw pubErr;
    testUsers.push(pubUser[0]);
  }

  // 3. Projects (Bulk)
  console.log('Seeding projects...');
  const projectNames = ['Skyline Towers', 'Green Valley Villas', 'Tech Park Hub', 'Oasis Mall', 'Blue Ridge Apartments', 'Sunset Boulevard', 'Metro Transit Station', 'City Center Square', 'Riverside Complex', 'Harbor View Residences', 'Mountain Peak Resort', 'Golden Gate Renovation'];
  const projectTypes = ['Residential', 'Commercial', 'Industrial', 'Interior'];
  const statuses = ['Active', 'Planning', 'Delayed', 'Completed', 'On Hold'];
  
  const projectInserts = projectNames.map((name, i) => ({
    organization_id: orgId,
    project_name: name,
    project_code: `PRJ-${String(i+1).padStart(3, '0')}`,
    project_type: randomItem(projectTypes),
    status: randomItem(statuses),
    budget: randomInt(1000000, 50000000),
    start_date: randomDate(new Date(2023, 0, 1), new Date(2026, 0, 1))
  }));

  const { data: projects, error: projErr } = await supabase.from('projects').insert(projectInserts).select();
  if (projErr || !projects) throw projErr;

  // 4. Project Members
  console.log('Seeding project members...');
  const projectMembers = [];
  for (const proj of projects) {
    for (const user of testUsers) {
      if (user.role !== 'Supplier' && user.role !== 'Admin') {
        if (Math.random() > 0.3) { // 70% chance to be in the project
          projectMembers.push({ project_id: proj.id, user_id: user.id, designation: user.role });
        }
      }
    }
  }
  await supabase.from('project_members').insert(projectMembers);

  // 5. Workers (Bulk)
  console.log('Seeding workers...');
  const workerNames = ['Ramesh Singh', 'Suresh Kumar', 'Amit Patel', 'Rajesh Sharma', 'Vikram Singh', 'Manoj Tiwari', 'Karan Gupta', 'Rahul Desai', 'Sanjay Verma', 'Deepak Yadav', 'Anil Kapoor', 'Sunil Shetty', 'Ravi Teja', 'Mohan Lal', 'Prakash Raj', 'Vijay Kumar', 'Dinesh Karthik', 'Sachin Tendulkar', 'Virat Kohli', 'Rohit Sharma', 'Hardik Pandya', 'Rishabh Pant', 'Shikhar Dhawan', 'KL Rahul', 'Jasprit Bumrah', 'Mohammed Shami', 'Ravindra Jadeja', 'Yuzvendra Chahal', 'Kuldeep Yadav', 'Bhuvneshwar Kumar'];
  const trades = ['Mason', 'Carpenter', 'Electrician', 'Plumber', 'Painter', 'Welder', 'Helper', 'Supervisor'];
  
  const workerInserts = workerNames.map(name => ({
    organization_id: orgId, worker_name: name, trade: randomItem(trades), daily_wage: randomInt(500, 1500)
  }));
  const { data: workers, error: workerErr } = await supabase.from('workers').insert(workerInserts).select();
  if (workerErr || !workers) throw workerErr;

  // 6. Attendance (Bulk)
  console.log('Seeding attendance...');
  const attendanceInserts = [];
  const activeProjects = projects.filter(p => p.status === 'Active');
  
  if (activeProjects.length > 0) {
    for (let i = 0; i < 14; i++) { // Last 14 days
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      for (const worker of workers) {
        if (Math.random() > 0.2) { // 80% present
          attendanceInserts.push({
            project_id: randomItem(activeProjects).id,
            worker_id: worker.id,
            attendance_date: dateStr,
            status: randomItem(['Present', 'Present', 'Present', 'Half Day', 'Overtime']),
            total_hours: randomInt(4, 10)
          });
        } else {
          attendanceInserts.push({
            project_id: randomItem(activeProjects).id,
            worker_id: worker.id,
            attendance_date: dateStr,
            status: 'Absent',
            total_hours: 0
          });
        }
      }
    }
  }
  
  // Insert attendance in batches of 500
  for (let i = 0; i < attendanceInserts.length; i += 500) {
    await supabase.from('attendance').insert(attendanceInserts.slice(i, i + 500));
  }

  // 7. Material Master & Suppliers
  console.log('Seeding materials and suppliers...');
  const materialsList = [
    { name: 'Cement (OPC 53)', unit: 'Bags' }, { name: 'TMT Steel 12mm', unit: 'Tons' },
    { name: 'River Sand', unit: 'Cubic Meters' }, { name: 'Crushed Stone 20mm', unit: 'Cubic Meters' },
    { name: 'Red Bricks', unit: 'Thousands' }, { name: 'Ceramic Tiles', unit: 'Sq Meters' },
    { name: 'PPR Pipes 1"', unit: 'Meters' }, { name: 'Copper Wire 2.5 sqmm', unit: 'Rolls' },
    { name: 'White Paint 20L', unit: 'Buckets' }, { name: 'Gypsum Board', unit: 'Pieces' }
  ];
  
  const { data: materials, error: matErr } = await supabase.from('material_master').insert(
    materialsList.map(m => ({ material_name: m.name, unit: m.unit, minimum_stock_level: randomInt(10, 100) }))
  ).select();
  if (matErr || !materials) throw matErr;

  const supplierNames = ['BuildMat Supplies', 'Steel King Ltd', 'Global Cement', 'City Hardware', 'National Traders', 'Apex Logistics'];
  const { data: suppliers, error: supErr } = await supabase.from('suppliers').insert(
    supplierNames.map(s => ({ company_name: s, phone: `98765${randomInt(10000, 99999)}` }))
  ).select();
  if (supErr || !suppliers) throw supErr;

  // 8. Material Inventory, Deliveries, Requests (Bulk)
  console.log('Seeding inventory, deliveries, requests...');
  const inventoryInserts = [];
  const deliveryInserts = [];
  const requestInserts = [];
  const siteEngineer = testUsers.find(u => u.role === 'Site Engineer');

  for (const proj of activeProjects) {
    for (const mat of materials) {
      const current = randomInt(0, 500);
      const received = current + randomInt(100, 1000);
      const consumed = received - current;
      
      inventoryInserts.push({
        project_id: proj.id, material_id: mat.id,
        current_stock: current, received_stock: received, consumed_stock: consumed
      });

      if (Math.random() > 0.5) {
        deliveryInserts.push({
          supplier_id: randomItem(suppliers).id, project_id: proj.id, material_id: mat.id,
          quantity: randomInt(50, 200), status: randomItem(['Ordered', 'In Transit', 'Delivered']),
          delivery_date: randomDate(new Date(2026, 0, 1), new Date())
        });
      }

      if (Math.random() > 0.7) {
        requestInserts.push({
          project_id: proj.id, requested_by: siteEngineer?.id, material_id: mat.id,
          quantity_requested: randomInt(10, 100), status: randomItem(['Pending', 'Approved', 'Ordered', 'Delivered'])
        });
      }
    }
  }
  
  await supabase.from('material_inventory').insert(inventoryInserts);
  await supabase.from('deliveries').insert(deliveryInserts);
  await supabase.from('material_requests').insert(requestInserts);

  // 9. Equipment (Bulk)
  console.log('Seeding equipment...');
  const equipNames = ['Excavator Cat 320', 'Concrete Mixer', 'Tower Crane', 'Dump Truck', 'Bulldozer', 'Compactor', 'Forklift', 'Generator 500kVA', 'Water Pump', 'Scaffolding Set'];
  const equipInserts = [];
  for (const proj of activeProjects) {
    const numEquip = randomInt(2, 6);
    for (let i = 0; i < numEquip; i++) {
      equipInserts.push({
        project_id: proj.id, equipment_name: randomItem(equipNames),
        equipment_type: randomItem(['Heavy', 'Machinery', 'Tools', 'Vehicles']),
        working_hours: randomInt(100, 2000), idle_hours: randomInt(10, 200),
        status: randomItem(['Active', 'Active', 'Active', 'Maintenance', 'Broken'])
      });
    }
  }
  await supabase.from('equipment').insert(equipInserts);

  // 10. Daily Logs & Activities (Bulk)
  console.log('Seeding daily logs and activities...');
  for (const proj of activeProjects) {
    for (let i = 0; i < 7; i++) { // Logs for last 7 days
      const dDate = new Date();
      dDate.setDate(dDate.getDate() - i);
      const dateStr = dDate.toISOString().split('T')[0];
      
      const { data: logs } = await supabase.from('daily_logs').insert([
        { project_id: proj.id, log_date: dateStr, progress_update: `Routine work completed for day. Weather was ${randomItem(['Sunny', 'Cloudy', 'Rainy'])}.` }
      ]).select();
      
      if (logs && logs.length > 0) {
        const activities = [];
        const numActs = randomInt(2, 5);
        for(let j=0; j<numActs; j++) {
          activities.push({
            project_id: proj.id, daily_log_id: logs[0].id,
            activity_name: randomItem(['Foundation Pouring', 'Column Reinforcement', 'Brickwork', 'Plastering', 'Electrical Wiring', 'Plumbing', 'Painting']),
            floor_number: randomItem(['Ground', '1st Floor', '2nd Floor', 'Basement']),
            status: randomItem(['Pending', 'In Progress', 'Completed']),
            quantity: randomInt(10, 500), unit: randomItem(['Cu.m', 'Sq.m', 'Running Meters', 'Nos'])
          });
        }
        await supabase.from('site_activities').insert(activities);
      }
    }
  }

  // 11. Issues (Bulk)
  console.log('Seeding site issues...');
  const issueInserts = [];
  const issueTitles = ['Delayed cement delivery', 'Worker strike', 'Crane breakdown', 'Heavy rain delay', 'Quality check failed', 'Drawing mismatch', 'Power outage', 'Water shortage', 'Safety incident'];
  for (const proj of projects) {
    const numIssues = randomInt(1, 5);
    for(let i=0; i<numIssues; i++) {
      issueInserts.push({
        project_id: proj.id,
        title: randomItem(issueTitles),
        description: 'Detailed description of the issue encountered at the site.',
        category: randomItem(['Safety', 'Material', 'Labour', 'Equipment', 'Weather']),
        priority: randomItem(['Low', 'Medium', 'High', 'Critical']),
        status: randomItem(['Open', 'In Progress', 'Resolved', 'Resolved'])
      });
    }
  }
  await supabase.from('site_issues').insert(issueInserts);

  // 12. Notifications
  console.log('Seeding notifications...');
  const adminUser = testUsers.find(u => u.role === 'Admin');
  if (adminUser) {
    await supabase.from('notifications').insert([
      { user_id: adminUser.id, title: 'Bulk Data Loaded', message: 'Successfully seeded large bulk data for application testing.', type: 'Issue' }
    ]);
  }

  console.log('BULK Seeding completed successfully!');
  console.log('=================================');
  console.log(`Generated: ${projectInserts.length} Projects, ${workerInserts.length} Workers, ${materialsList.length} Materials, ${equipInserts.length} Equipment.`);
  console.log('Passwords for all: password123');
  for (const u of testUsers) console.log(`- ${u.role}: ${u.email}`);
  console.log('=================================');
}

async function main() {
  try {
    await clearData();
    await seedData();
  } catch (err: any) {
    console.error('Error during bulk seeding:', err.message || err);
  } finally {
    process.exit(0);
  }
}

main();

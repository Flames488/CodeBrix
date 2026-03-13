
def new_lead_workflow(lead):
    name = lead.get("name")
    return f"Lead {name} captured and workflow triggered"

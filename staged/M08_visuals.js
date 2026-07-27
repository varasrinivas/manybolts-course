case 'mb_merge_queue': {
      let out = '';
      const items = [['appeals','var(--t1)'], ['gate','var(--t2)'], ['portal','var(--t3)'], ['appeals','var(--t1)']];
      items.forEach(function(it, i){
        const x = 20 + i * 96;
        out += '<rect x="' + x + '" y="46" width="84" height="30" rx="6" fill="var(--card)" stroke="' + it[1] + '" stroke-width="1.4"></rect>' +
          '<text x="' + (x + 42) + '" y="65" text-anchor="middle" font-size="10.5" fill="var(--ink)">' + it[0] + '</text>';
      });
      return '<div class="viz"><div class="viz-body"><svg viewBox="0 0 680 200" role="img" ' +
        'aria-label="Four bolts queue, each rebased onto the current trunk and tested before landing; a failure bisects the batch rather than blocking the queue">' +
        '<text x="20" y="30" font-size="11.5" fill="var(--muted)">ready to land — four bolts, three mobs, one trunk</text>' + out +
        '<rect x="408" y="40" width="120" height="42" rx="7" fill="var(--paper-2)" stroke="var(--ok)" stroke-width="2"></rect>' +
        '<text x="468" y="58" text-anchor="middle" font-size="11" fill="var(--ink)">rebase + test</text>' +
        '<text x="468" y="73" text-anchor="middle" font-size="10" fill="var(--ok)">against real trunk</text>' +
        '<rect x="560" y="40" width="100" height="42" rx="7" fill="var(--card)" stroke="var(--ink-2)" stroke-width="1.6"></rect>' +
        '<text x="610" y="65" text-anchor="middle" font-size="11.5" fill="var(--ink)">trunk</text>' +
        '<text x="20" y="118" font-size="11" fill="var(--ink)">Batch of 4 with bisect-on-failure: throughput of 4 changes per 34-minute run.</text>' +
        '<text x="20" y="138" font-size="11" fill="var(--muted)">Serial landing caps the platform at 14 changes a day — under three mobs&#39; output.</text>' +
        '<text x="20" y="166" font-size="11" fill="var(--bad)">Build the whole repository. Module-scoped builds are what let a wide agent diff break a caller.</text>' +
        '<text x="20" y="186" font-size="11" fill="var(--muted)">No merge queue spans repositories. That gap is M09.</text>' +
        '</svg></div><div class="viz-cap">Serialisation at the point of landing. The only mechanism that survives six concurrent bolts.</div></div>';
    }

    case 'mb_migration_collision': {
      return '<div class="viz"><div class="viz-body"><svg viewBox="0 0 680 216" role="img" ' +
        'aria-label="Both mobs write V47 migrations altering the same table; renumbering makes the build pass while leaving a schema neither mob designed">' +
        '<rect x="14" y="18" width="300" height="64" rx="8" fill="var(--card)" stroke="var(--t1)" stroke-width="1.5"></rect>' +
        '<text x="28" y="38" font-size="11" font-family="var(--mono)" fill="var(--ink)">appeals: V47__add_appeal_states.sql</text>' +
        '<text x="28" y="56" font-size="10.5" fill="var(--muted)">ALTER TABLE determination ADD appeal_ref</text>' +
        '<text x="28" y="73" font-size="10.5" fill="var(--ok)">green on its branch</text>' +
        '<rect x="366" y="18" width="300" height="64" rx="8" fill="var(--card)" stroke="var(--t2)" stroke-width="1.5"></rect>' +
        '<text x="380" y="38" font-size="11" font-family="var(--mono)" fill="var(--ink)">gate: V47__criteria_threshold.sql</text>' +
        '<text x="380" y="56" font-size="10.5" fill="var(--muted)">ALTER TABLE determination ADD threshold_used</text>' +
        '<text x="380" y="73" font-size="10.5" fill="var(--ok)">green on its branch</text>' +
        '<line x1="164" y1="84" x2="300" y2="112" stroke="var(--t1)" stroke-width="1.4"></line>' +
        '<line x1="516" y1="84" x2="380" y2="112" stroke="var(--t2)" stroke-width="1.4"></line>' +
        '<rect x="196" y="114" width="288" height="44" rx="8" fill="var(--paper-2)" stroke="var(--bad)" stroke-width="2"></rect>' +
        '<text x="340" y="132" text-anchor="middle" font-size="11.5" fill="var(--bad)">PD-1 — same version, same table</text>' +
        '<text x="340" y="149" text-anchor="middle" font-size="10.5" fill="var(--ink-2)">renumbering fixes the filename, not the schema</text>' +
        '<text x="14" y="186" font-size="11" fill="var(--ink)">Expand &#8594; migrate &#8594; contract makes landing order irrelevant, which is the actual fix.</text>' +
        '<text x="14" y="206" font-size="11" fill="var(--muted)">Plus a fifteen-line merge check that rejects duplicate versions and closes the class.</text>' +
        '</svg></div><div class="viz-cap">The mechanical fix and the real fix are different here. That is why it is a good planted defect.</div></div>';
    }

    case 'mb_stack_landing': {
      const stack = [['UOW-41a  status enum', 'Tier 2', 'var(--t3)'], ['UOW-41b  appeal endpoint', 'Tier 2', 'var(--t3)'], ['UOW-41c  queue column width', 'Tier 0', 'var(--ok)']];
      let out = '';
      stack.forEach(function(s, i){
        const y = 40 + i * 36;
        out += '<rect x="14" y="' + y + '" width="290" height="28" rx="5" fill="var(--card)" stroke="var(--rule)"></rect>' +
          '<text x="28" y="' + (y + 18) + '" font-size="10.5" font-family="var(--mono)" fill="var(--ink)">' + s[0] + '</text>' +
          '<text x="240" y="' + (y + 18) + '" font-size="10.5" fill="' + s[2] + '">' + s[1] + '</text>';
      });
      return '<div class="viz"><div class="viz-body"><svg viewBox="0 0 680 190" role="img" ' +
        'aria-label="Three stacked entries carry their own tiers; the same work as one combined diff collapses to Tier 3 and consumes the scarce validator">' +
        '<text x="14" y="26" font-size="11.5" fill="var(--muted)">stacked: one unit of work per entry</text>' + out +
        '<text x="360" y="26" font-size="11.5" fill="var(--muted)">unstacked: one 40-file diff</text>' +
        '<rect x="360" y="40" width="290" height="100" rx="7" fill="var(--paper-2)" stroke="var(--bad)" stroke-width="1.6"></rect>' +
        '<text x="374" y="66" font-size="11" fill="var(--ink)">everything above, together</text>' +
        '<text x="374" y="90" font-size="11" fill="var(--bad)">collapses to Tier 3 — the highest tier it contains</text>' +
        '<text x="374" y="112" font-size="10.5" fill="var(--muted)">so the SME reviews the column width too</text>' +
        '<text x="14" y="176" font-size="11" fill="var(--ink)">Stacking is what makes tiering possible. Without it, cosmetic work queues behind clinical review.</text>' +
        '</svg></div><div class="viz-cap">The trunk argument for stacking is old. The tiering argument is new, and stronger.</div></div>';
    }

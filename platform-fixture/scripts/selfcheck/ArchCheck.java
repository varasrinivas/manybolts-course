import java.io.IOException;
import java.nio.file.*;
import java.util.*;
import java.util.regex.*;
import java.util.stream.Stream;

/**
 * Minimal dependency-direction check, for when ArchUnit cannot be resolved.
 *
 * <p>Reads imports out of the sources and fails when a package matching the
 * "from" pattern imports one matching a "forbidden" pattern.
 *
 * <p>Usage: java ArchCheck <sourceRoot> <fromPackageFragment> <forbiddenFragment>...
 */
public final class ArchCheck {

    public static void main(String[] args) throws IOException {
        if (args.length < 3) {
            System.err.println("usage: ArchCheck <sourceRoot> <from> <forbidden>...");
            System.exit(2);
        }
        Path root = Paths.get(args[0]);
        String from = args[1];
        List<String> forbidden = Arrays.asList(args).subList(2, args.length);
        Pattern pkg = Pattern.compile("^package\\s+([\\w.]+)\\s*;");
        Pattern imp = Pattern.compile("^import\\s+(?:static\\s+)?([\\w.]+)\\s*;");

        List<String> violations = new ArrayList<>();
        try (Stream<Path> files = Files.walk(root)) {
            for (Path f : (Iterable<Path>) files.filter(p -> p.toString().endsWith(".java"))::iterator) {
                String owner = null;
                int lineNo = 0;
                for (String line : Files.readAllLines(f)) {
                    lineNo++;
                    Matcher pm = pkg.matcher(line.trim());
                    if (pm.find()) {
                        owner = pm.group(1);
                        if (!owner.contains(from)) break;
                        continue;
                    }
                    if (owner == null) continue;
                    Matcher im = imp.matcher(line.trim());
                    if (im.find()) {
                        String imported = im.group(1);
                        for (String bad : forbidden) {
                            if (imported.contains(bad)) {
                                violations.add(f + ":" + lineNo + "  " + owner + " -> " + imported);
                            }
                        }
                    }
                }
            }
        }

        System.out.println("rule: no class in .." + from + ".. may depend on " + forbidden);
        if (violations.isEmpty()) {
            System.out.println("PASS  no violations");
            return;
        }
        violations.forEach(v -> System.out.println("FAIL  " + v));
        System.out.println(violations.size() + " violation(s)");
        System.exit(1);
    }
}
